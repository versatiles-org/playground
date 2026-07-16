import * as fs from 'node:fs';
import toc from '../playground/toc.ts';
import server, { url } from './dev.ts';
import { trackNetwork, waitForMapRendered } from './lib/browser.ts';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
	headless: true,
	defaultViewport: { width: 1800, height: 1000, deviceScaleFactor: 1 },
});

try {
	for (const entry of toc) {
		for (const example of entry.examples) {
			console.log(`Screenshot for ${example}`);

			// A page per example: the network tracker has to exist before the first
			// request, and its counter should not carry over between examples.
			const page = await browser.newPage();
			const tracker = trackNetwork(page);

			try {
				await page.goto(`${url}/${example}/?screenshot=1`);

				await page.waitForSelector('.vp-playground.vp-screenshot', { timeout: 10000 });
				const playground = (await page.$('.vp-playground.vp-screenshot'))!;
				await playground.scrollIntoView();

				if (!(await waitForMapRendered(page, tracker))) {
					throw new Error(
						`Map never finished rendering for ${example}; refusing to publish a blank preview`,
					);
				}

				const clip = await playground.boundingBox();
				if (!clip) throw new Error(`No bounding box found for ${example}`);
				const buffer = await page.screenshot({
					type: 'png',
					encoding: 'binary',
					clip,
					captureBeyondViewport: true,
				});
				fs.writeFileSync(`./playground/${example}/preview.png`, buffer);
			} finally {
				tracker.stop();
				await page.close();
			}
		}
	}
} finally {
	// Node tears the process down on an unhandled rejection anyway, so this is
	// tidy shutdown rather than a hang fix: it keeps the thrown error as the
	// visible failure instead of an unhandled-rejection trace.
	await browser.close();
	await new Promise<void>((resolve) => server.close(() => resolve()));
}
