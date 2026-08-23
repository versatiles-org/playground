import * as assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import server, { url } from '../dev.ts';
import { previewFrame } from '../lib/browser.ts';
import puppeteer, { type Browser, type Page } from 'puppeteer';

/**
 * Tests the live editor itself, which the example smoke test never touches: it
 * only ever looks at what an example rendered, not at the editor around it.
 */

const EXAMPLE = 'add-marker';

let browser: Browser;
let page: Page;

/** Marks the current preview document, so a re-run can be told from a no-op. */
async function markPreview(): Promise<void> {
	const preview = await previewFrame(page);
	await preview.waitForSelector('canvas.maplibregl-canvas');
	await preview.evaluate('window.__generation = 1');
}

/** Whether the preview was replaced since {@link markPreview}. */
async function previewWasReplaced(): Promise<boolean> {
	const preview = await previewFrame(page);
	// Evaluated as source rather than as a function: tsx rewrites function
	// expressions for its own bookkeeping, which does not survive the trip.
	return (await preview.evaluate('typeof window.__generation === "undefined"')) as boolean;
}

before(async () => {
	browser = await puppeteer.launch({
		headless: true,
		defaultViewport: { width: 1200, height: 900 },
	});
	page = await browser.newPage();
	page.setDefaultTimeout(20_000);
	await page.goto(`${url}/${EXAMPLE}/`, { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('.vp-playground');
});

after(async () => {
	await browser.close();
	await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('mounts an editor, a preview and a run button', async () => {
	assert.ok(await page.$('iframe.vp-preview'), 'preview iframe');
	assert.ok(await page.$('.vp-editor'), 'code editor');
	assert.ok(await page.$('button.vp-run'), 'run button');
});

test('fills the editor with the example source', async () => {
	const code = await page.$eval('.vp-editor', (el) => el.textContent ?? '');
	assert.match(code, /^<!DOCTYPE html>/);
	assert.match(code, /maplibregl\.Map/);
});

test('labels the shortcut on the run button', async () => {
	const hint = await page.$eval('.vp-key', (el) => el.textContent ?? '');
	assert.match(hint, /^(Ctrl\+↩|⌘↩)$/, `unexpected shortcut hint ${JSON.stringify(hint)}`);
});

test('does not run while typing', async () => {
	await markPreview();
	await page.click('.vp-editor');
	await page.keyboard.type('\n<!-- typed -->\n');
	// Comfortably longer than the auto-run this component used to do.
	await new Promise((resolve) => setTimeout(resolve, 2_000));

	assert.equal(await previewWasReplaced(), false, 'typing must not re-render the preview');
});

test('runs when the button is pressed', async () => {
	await markPreview();
	await page.click('button.vp-run');

	assert.equal(await previewWasReplaced(), true, 'the run button must re-render the preview');
	const preview = await previewFrame(page);
	await preview.waitForSelector('canvas.maplibregl-canvas');
});

test('runs on Ctrl+Enter, without typing a newline', async () => {
	await markPreview();
	await page.click('.vp-editor');
	const before = await page.$eval('.vp-editor', (el) => el.textContent ?? '');

	await page.keyboard.down('Control');
	await page.keyboard.press('Enter');
	await page.keyboard.up('Control');

	assert.equal(await previewWasReplaced(), true, 'the shortcut must re-render the preview');
	assert.equal(
		await page.$eval('.vp-editor', (el) => el.textContent ?? ''),
		before,
		'the shortcut must not reach the editor',
	);
});

test('switches to the screenshot layout when asked', async () => {
	const shot = await browser.newPage();
	try {
		await shot.goto(`${url}/${EXAMPLE}/?screenshot=1`, { waitUntil: 'domcontentloaded' });
		await shot.waitForSelector('.vp-playground.vp-screenshot');
	} finally {
		await shot.close();
	}
});
