import * as fs from 'node:fs';
import * as path from 'node:path';

export function copyAssets(src: string, dest: string) {
	const entries = fs.readdirSync(src, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.isDirectory()) continue;
		if (!/\.(html|css|js|json|geojson|png)$/.test(entry.name)) continue;
		fs.copyFileSync(path.join(src, entry.name), path.join(dest, entry.name));
	}
}
