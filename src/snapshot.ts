import { chromium } from 'playwright';

export async function takeSnapshot(url: string, bufferMs = 5000, clickToPlay = false): Promise<string> {
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

    // Wait for the stream to render
    await page.waitForTimeout(bufferMs);

    let buffer: Buffer;
    if (bestIndex >= 0) {
      buffer = await iframes.nth(bestIndex).screenshot({ type: 'jpeg', quality: 75 });
    } else {
      // Fall back to a full viewport screenshot
      buffer = await page.screenshot({ type: 'jpeg', quality: 75 });
    }

    return buffer.toString('base64');
  } finally {
    await browser.close();
  }
}
