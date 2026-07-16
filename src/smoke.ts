import toc from '../playground/toc.ts';
import server, { url } from './dev.ts';
import puppeteer, { type Browser, type Page } from 'puppeteer';
import { PNG } from 'pngjs';

/**
 * Smoke-tests every example: loads its page, waits for the map to settle, and
 * fails if the browser reported an error or the map never painted anything.
 *
 * Deliberately does not compare against reference images — tiles are fetched
 * from the live network, so exact pixels are not reproducible across runs or
 * platforms. This only asserts "the example still runs".
 */

const TIMEOUT = 30_000;
const TILE_RENDER_DELAY = 3000;

function describe(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

async function checkExample(browser: Browser, slug: string): Promise<string[]> {
	const problems: string[] = [];
	const page = await browser.newPage();

	// Errors thrown inside the srcdoc iframe surface on the parent page too.
	page.on('pageerror', (err) => problems.push(`uncaught error: ${describe(err)}`));
	page.on('console', (msg) => {
		if (msg.type() === 'error') problems.push(`console error: ${msg.text()}`);
	});
	page.on('requestfailed', (req) => {
		const reason = req.failure()?.errorText ?? 'unknown';
		problems.push(`request failed: ${req.url()} (${reason})`);
	});
	// A 404 is a *successful* request, so requestfailed never sees it.
	page.on('response', (res) => {
		if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
	});

	try {
		await page.goto(`${url}/${slug}/?screenshot=1`, { waitUntil: 'domcontentloaded' });
		const playground = await page.waitForSelector('.vp-playground.vp-screenshot', {
			timeout: TIMEOUT,
		});
		if (!playground) throw new Error('playground element never appeared');

		await page.waitForFunction(
			() => {
				const iframe = document.querySelector<HTMLIFrameElement>(
					'.vp-playground iframe.vp-preview',
				);
				return !!iframe?.contentDocument?.querySelector('.maplibregl-canvas');
			},
			{ timeout: TIMEOUT },
		);
		await new Promise((resolve) => setTimeout(resolve, TILE_RENDER_DELAY));

		if (!(await hasRenderedMap(page))) {
			problems.push('map preview is blank (rendered as a single flat color)');
		}
	} catch (err) {
		problems.push(describe(err));
	} finally {
		await page.close();
	}

	return problems;
}

/**
 * True if the rendered map shows more than one distinct color.
 *
 * Screenshots the preview iframe rather than reading the WebGL canvas directly:
 * MapLibre runs without `preserveDrawingBuffer`, so drawImage/toDataURL on its
 * canvas yield an empty buffer. Puppeteer captures via the compositor instead.
 */
async function hasRenderedMap(page: Page): Promise<boolean> {
	const iframe = await page.$('.vp-playground iframe.vp-preview');
	if (!iframe) return false;

	const buffer = await iframe.screenshot({ type: 'png', encoding: 'binary' });
	const { data } = PNG.sync.read(Buffer.from(buffer));

	const colors = new Set<number>();
	for (let i = 0; i < data.length; i += 4) {
		colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
		if (colors.size > 1) return true;
	}
	return false;
}

const browser = await puppeteer.launch({
	headless: true,
	defaultViewport: { width: 1200, height: 800, deviceScaleFactor: 1 },
});

let failed = false;
try {
	for (const group of toc) {
		for (const slug of group.examples) {
			const problems = await checkExample(browser, slug);
			if (problems.length === 0) {
				console.log(`✅ ${slug}`);
			} else {
				failed = true;
				console.log(`❌ ${slug}`);
				for (const problem of problems) console.log(`     ${problem}`);
			}
		}
	}
} finally {
	await browser.close();
	await new Promise<void>((resolve) => server.close(() => resolve()));
}

if (failed) {
	console.error('\nSmoke test failed: at least one example is broken.');
	process.exit(1);
}
console.log('\nAll examples OK.');
