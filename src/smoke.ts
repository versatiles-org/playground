import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import toc from '../playground/toc.ts';
import server, { url } from './dev.ts';
import { previewFrame, trackNetwork, waitForMapRendered } from './lib/browser.ts';
import type { ExampleCheck } from './lib/check.ts';
import puppeteer, { type Browser, type HTTPRequest, type Page } from 'puppeteer';

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

/**
 * Runs `playground/$slug/check.ts`, if the example has one. A hanging check would
 * otherwise stall the whole run, so it gets the same budget as everything else.
 */
async function runCheck(slug: string, page: Page): Promise<string[]> {
	const file = path.resolve('playground', slug, 'check.ts');
	if (!fs.existsSync(file)) return [];

	const { default: check } = (await import(pathToFileURL(file).href)) as { default: ExampleCheck };

	// Comfortably below the overall budget, so a missing element is reported as the
	// selector that never appeared rather than as an anonymous overall timeout.
	page.setDefaultTimeout(TIMEOUT / 2);

	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		await Promise.race([
			check({ page, preview: await previewFrame(page) }),
			new Promise((_, reject) => {
				timer = setTimeout(
					() => reject(new Error(`check timed out after ${TIMEOUT} ms`)),
					TIMEOUT,
				);
			}),
		]);
		return [];
	} catch (err) {
		return [`check failed: ${describe(err)}`];
	} finally {
		clearTimeout(timer);
	}
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
	// The page *around* the example — the site's stylesheet, its logo, the GitHub
	// icon — is not the example's doing, and an outage there has already turned CI
	// red for a decorative image. Anything the preview loads still counts, including
	// MapLibre's tile requests: those come from a worker and have no frame at all.
	const fromPageShell = (req: HTTPRequest) => req.frame() === page.mainFrame();

	page.on('requestfailed', (req) => {
		if (fromPageShell(req)) return;
		const reason = req.failure()?.errorText ?? 'unknown';
		// MapLibre cancels tile requests as soon as a tile is no longer needed, which
		// happens routinely while terrain is loading: the elevation data changes which
		// tiles are visible. Those aborts are the map working, not the example failing.
		if (reason === 'net::ERR_ABORTED') return;
		problems.push(`request failed: ${req.url()} (${reason})`);
	});
	// A 404 is a *successful* request, so requestfailed never sees it.
	page.on('response', (res) => {
		if (fromPageShell(res.request())) return;
		if (res.status() >= 400) problems.push(`HTTP ${res.status()}: ${res.url()}`);
	});

	try {
		await page.goto(`${url}/${slug}/?screenshot=1`, { waitUntil: 'domcontentloaded' });
		await page.waitForSelector('.vp-playground.vp-screenshot', { timeout: TIMEOUT });

		if (!(await waitForMapRendered(page, tracker, { timeoutMs: TIMEOUT }))) {
			problems.push('map never finished rendering (canvas stayed blank or kept changing)');
		} else {
			problems.push(...(await runCheck(slug, page)));
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
