import toc from '../playground/toc.ts';
import server from './dev.ts';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
	headless: true,
	defaultViewport: { width: 1000, height: 1000, deviceScaleFactor: 1 },
});
const page = await browser.newPage();

for (const entry of toc) {
	for (const example of entry.examples) {
		console.log(`Screenshot for ${example}`);
		await page.goto(`http://localhost:8080/${example}/`);

		const iframe = await page.$('#livecodes');
		if (!iframe) throw new Error(`No iframe found for ${example}`);
		iframe.scrollIntoView();
		await new Promise((r) => setTimeout(r, 8000));

		const clip = await iframe.boundingBox();
		if (!clip) throw new Error(`No bounding box found for ${example}`);
		const buffer = await page.screenshot({
			type: 'png',
			encoding: 'binary',
			clip,
			captureBeyondViewport: false,
		}) as Uint8Array;
		await Deno.writeFile(`./playground/${example}/preview.png`, buffer);
	}
}

await page.close();
await browser.close();
await server.shutdown();
