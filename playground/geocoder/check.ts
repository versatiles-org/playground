import * as assert from 'node:assert/strict';
import type { ExampleCheck } from '../../src/lib/check.ts';

/**
 * Runs a search. This talks to the live Photon backend, so it also covers the
 * part of the example that no amount of rendering can prove: that our geocoding
 * service still answers in the shape the plugin expects.
 *
 * The query is submitted with Enter — the plugin only searches while typing when
 * `showResultsWhileTyping` is set, which this example leaves at its default.
 */
const check: ExampleCheck = async ({ preview }) => {
	await preview.type('input.maplibregl-ctrl-geocoder--input', 'Bremen');
	await preview.focus('input.maplibregl-ctrl-geocoder--input');
	await preview.page().keyboard.press('Enter');

	await preview.waitForSelector('.suggestions li');
	const suggestions = await preview.$$eval('.suggestions li', (items) =>
		items.map((item) => item.textContent ?? ''),
	);
	assert.ok(suggestions.length > 0, 'the geocoder should offer at least one result');
	assert.match(
		suggestions.join(' | '),
		/Bremen/i,
		`results should match the query, got ${suggestions.join(' | ')}`,
	);
};

export default check;
