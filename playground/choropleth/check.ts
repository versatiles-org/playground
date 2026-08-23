import * as assert from 'node:assert/strict';
import type { ExampleCheck } from '../../src/lib/check.ts';

/**
 * Clicking the centre of the map hits a state, because the initial view is
 * fitted to Germany.
 */
const check: ExampleCheck = async ({ preview }) => {
	const canvas = 'canvas.maplibregl-canvas';

	await preview.hover(canvas);
	const cursor = await preview.$eval(canvas, (el) => getComputedStyle(el).cursor);
	assert.equal(cursor, 'pointer', 'hovering a state should mark it as clickable');

	await preview.click(canvas);
	await preview.waitForSelector('.maplibregl-popup-content');
	const text = await preview.$eval('.maplibregl-popup-content', (el) => el.textContent ?? '');
	assert.match(text, /inhabitants/, `popup should show the population, got ${JSON.stringify(text)}`);
	assert.match(text, /per km²/, `popup should show the density, got ${JSON.stringify(text)}`);
};

export default check;
