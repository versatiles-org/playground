import toc from '../playground/toc.ts';
import server, { url } from './dev.ts';
import { trackNetwork, waitForMapRendered } from './lib/browser.ts';
import puppeteer, { type Browser } from 'puppeteer';

/**
 * Smoke-tests every example: loads its page, waits for the map to finish
 * rendering, and fails if the browser reported an error or the map never drew.
 *
 * Deliberately does not compare against reference images — tiles are fetched
 * from the live network, so exact pixels are not reproducible across runs or
 * platforms. This only asserts "the example still runs".
 */

const TIMEOUT = 30_000;

function describe(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

async function checkExample(browser: Browser, slug: string): Promise<string[]> {
	const problems: string[] = [];
	const page = await browser.newPage();
	// Created before navigating, so no request goes uncounted.
	const tracker = trackNetwork(page);

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
		await page.waitForSelector('.vp-playground.vp-screenshot', { timeout: TIMEOUT });

		if (!(await waitForMapRendered(page, tracker, { timeoutMs: TIMEOUT }))) {
			problems.push('map never finished rendering (canvas stayed blank or kept changing)');
		}
	} catch (err) {
		problems.push(describe(err));
	} finally {
		tracker.stop();
		await page.close();
	}

	return problems;
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
