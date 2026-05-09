import { chromium } from 'playwright';

export async function takeSnapshot(
  url: string,
  bufferMs = 5000,
  clickToPlay = false,
  skipAd = false,
): Promise<string> {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Give the page time to settle before looking for the player
    await page.waitForTimeout(3000);

    // Find the largest iframe on the page — that's the video player
    const iframes = page.locator('iframe');
    const count = await iframes.count();

    let bestIndex = -1;
    let bestArea = 0;

    for (let i = 0; i < count; i++) {
      const box = await iframes.nth(i).boundingBox();
      if (box && box.width * box.height > bestArea) {
        bestArea = box.width * box.height;
        bestIndex = i;
      }
    }

    // If this cam needs a click to start, click the center of the iframe
    if (clickToPlay && bestIndex >= 0) {
      const box = await iframes.nth(bestIndex).boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
    }

    // Handle pre-roll ads — wait for skip button and click it, or wait out the ad
    if (skipAd) {
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

      let skipped = false;

      // Try clicking skip inside every iframe
      for (let i = 0; i < count; i++) {
        if (skipped) break;
        try {
          const frame = page.frameLocator(`iframe >> nth=${i}`);
          for (const selector of skipSelectors) {
            try {
              const btn = frame.locator(selector).first();
              if (await btn.isVisible({ timeout: 1000 })) {
                await btn.click();
                skipped = true;
                break;
              }
            } catch {
              // selector not found in this frame, try next
            }
          }
        } catch {
          // frame not accessible, move on
        }
      }

      if (!skipped) {
        // No skip button found — wait out a standard ad (30s total from page load)
        await page.waitForTimeout(21000);
      }
    }

    // Wait for the actual stream to render
    await page.waitForTimeout(bufferMs);

    let buffer: Buffer;
    if (bestIndex >= 0) {
      buffer = await iframes.nth(bestIndex).screenshot({ type: 'jpeg', quality: 75 });
    } else {
      buffer = await page.screenshot({ type: 'jpeg', quality: 75 });
    }

    return buffer.toString('base64');
  } finally {
    await browser.close();
  }
}
