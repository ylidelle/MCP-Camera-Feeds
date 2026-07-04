import { chromium, type Browser, type Page } from 'playwright';
import type { Camera } from './cameras.js';

export async function takeSnapshot(camera: Camera): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  try {
    switch (camera.strategy) {
      case 'youtube-embed':
        return await snapshotYouTubeEmbed(browser, camera);
      case 'camzone':
        return await snapshotCamzone(browser, camera);
      case 'video-element':
        return await snapshotVideoElement(browser, camera, camera.url);
      default:
        return await snapshotLargestIframe(browser, camera);
    }
  } finally {
    await browser.close();
  }
}

// Read the CamZone player iframe src off the zoo page and load it directly.
// San Diego Zoo overlays an email-signup wall on some cam pages, but the
// player itself streams fine when loaded standalone.
async function snapshotCamzone(browser: Browser, camera: Camera): Promise<string> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(camera.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const playerUrl = await page
    .locator('iframe[src*="camzonecdn.com"]')
    .first()
    .getAttribute('src', { timeout: 15000 });
  if (!playerUrl) {
    throw new Error(`No CamZone player iframe found on ${camera.url} — the cam page layout may have changed.`);
  }
  await context.close();
  return snapshotVideoElement(browser, camera, playerUrl);
}

// Load a page, force its <video> elements to play muted, screenshot the
// largest one. Falls back to a full-page screenshot if no video renders.
async function snapshotVideoElement(browser: Browser, camera: Camera, url: string): Promise<string> {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Some players (CamZone) want a real click to start; harmless otherwise
  const firstVideo = page.locator('video').first();
  try {
    await firstVideo.waitFor({ state: 'visible', timeout: 10000 });
    const box = await firstVideo.boundingBox();
    if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  } catch {
    // no video yet — the play() below may still bring one up
  }
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
  });

  // Wait until at least one video is actually rendering frames — HLS streams
  // can buffer well past any fixed delay (spinner screenshots otherwise)
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll('video')].some(
          (v) => !v.paused && v.readyState >= 2 && v.currentTime > 0.5
        ),
      { timeout: 30000 }
    )
    .catch(() => {}); // fall through — a stalled cam still gets its best-effort frame

  await page.waitForTimeout(camera.bufferMs ?? 5000);

  const videos = page.locator('video');
  const count = await videos.count();
  let bestIndex = -1;
  let bestArea = 0;
  for (let i = 0; i < count; i++) {
    const box = await videos.nth(i).boundingBox().catch(() => null);
    if (box && box.width * box.height > bestArea) {
      bestArea = box.width * box.height;
      bestIndex = i;
    }
  }

  const buffer =
    bestIndex >= 0
      ? await videos.nth(bestIndex).screenshot({ type: 'jpeg', quality: 75, timeout: 15000 })
      : await page.screenshot({ type: 'jpeg', quality: 75 });
  return buffer.toString('base64');
}

// Read [data-video-id] off the cam page, then load the YouTube embed directly.
// The embed is restricted to the aquarium's domain, so the cam page URL goes
// in as referer — without it YouTube answers with player error 153.
async function snapshotYouTubeEmbed(browser: Browser, camera: Camera): Promise<string> {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    extraHTTPHeaders: { referer: new URL(camera.url).origin + '/' },
  });
  const page = await context.newPage();

  await page.goto(camera.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const videoId = await page
    .locator('[data-video-id]')
    .first()
    .getAttribute('data-video-id', { timeout: 10000 });
  if (!videoId) {
    throw new Error(`No [data-video-id] found on ${camera.url} — the cam page layout may have changed.`);
  }

  await page.goto(
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`,
    { waitUntil: 'domcontentloaded', timeout: 30000 }
  );

  const video = page.locator('video').first();
  await video.waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(camera.bufferMs ?? 8000);

  const buffer = await video.screenshot({ type: 'jpeg', quality: 75, timeout: 15000 });
  return buffer.toString('base64');
}

// Original strategy: screenshot the largest visible iframe on the page.
async function snapshotLargestIframe(browser: Browser, camera: Camera): Promise<string> {
  const { bufferMs = 5000, clickToPlay = false, skipAd = false } = camera;
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto(camera.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Give the page time to settle before looking for the player
  await page.waitForTimeout(3000);

  const bestIndex = await findLargestVisibleIframe(page);

  // If this cam needs a click to start, click the center of the iframe
  if (clickToPlay && bestIndex >= 0) {
    const box = await page.locator('iframe').nth(bestIndex).boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }
  }

  // Handle pre-roll ads — wait for skip button and click it, or wait out the ad
  if (skipAd) {
    await skipPrerollAd(page);
  }

  // Wait for the actual stream to render
  await page.waitForTimeout(bufferMs);

  let buffer: Buffer;
  if (bestIndex >= 0) {
    buffer = await page
      .locator('iframe')
      .nth(bestIndex)
      .screenshot({ type: 'jpeg', quality: 75 });
  } else {
    buffer = await page.screenshot({ type: 'jpeg', quality: 75 });
  }

  return buffer.toString('base64');
}

// Largest iframe that is actually on screen — offscreen embeds (subscribe
// buttons, trackers) can be "biggest" by area but hang element screenshots.
async function findLargestVisibleIframe(page: Page): Promise<number> {
  const iframes = page.locator('iframe');
  const count = await iframes.count();
  const viewport = page.viewportSize() ?? { width: 1280, height: 800 };

  let bestIndex = -1;
  let bestArea = 0;

  for (let i = 0; i < count; i++) {
    const box = await iframes.nth(i).boundingBox();
    if (!box) continue;
    const onScreen =
      box.x + box.width > 0 && box.y + box.height > 0 && box.x < viewport.width;
    if (onScreen && box.width * box.height > bestArea) {
      bestArea = box.width * box.height;
      bestIndex = i;
    }
  }

  return bestIndex;
}

async function skipPrerollAd(page: Page): Promise<void> {
  // Ads typically allow skipping after 5 seconds
  await page.waitForTimeout(6000);

  const skipSelectors = [
    'text=Skip Ad',
    'text=Skip ad',
    'text=Skip',
    '[class*="skip-ad"]',
    '[class*="skipAd"]',
    '[id*="skip"]',
    '.vjs-skip-button',
  ];

  const count = await page.locator('iframe').count();

  // Try clicking skip inside every iframe
  for (let i = 0; i < count; i++) {
    try {
      const frame = page.frameLocator(`iframe >> nth=${i}`);
      for (const selector of skipSelectors) {
        try {
          const btn = frame.locator(selector).first();
          if (await btn.isVisible({ timeout: 1000 })) {
            await btn.click();
            return;
          }
        } catch {
          // selector not found in this frame, try next
        }
      }
    } catch {
      // frame not accessible, move on
    }
  }

  // No skip button found — wait out a standard ad (30s total from page load)
  await page.waitForTimeout(21000);
}
