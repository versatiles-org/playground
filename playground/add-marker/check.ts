import * as assert from 'node:assert/strict';
import type { ExampleCheck } from '../../src/lib/check.ts';

/** The popup is only created on click, so rendering alone never exercises it. */
const check: ExampleCheck = async ({ preview }) => {
	await preview.click('.maplibregl-marker');

	await preview.waitForSelector('.maplibregl-popup-content');
	const text = await preview.$eval('.maplibregl-popup-content', (el) => el.textContent ?? '');
	assert.match(text, /Venice/, `popup should name the place, got ${JSON.stringify(text)}`);
};

export default check;
