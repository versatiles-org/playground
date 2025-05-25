export function copyAssets(src: string, dest: string) {
	const entries = Deno.readDirSync(src);
	for (const entry of entries) {
		if (entry.isDirectory) continue;
		if (!/\.(css|js|json|geojson|png)$/.test(entry.name)) continue;
		const srcPath = `${src}/${entry.name}`;
		const destPath = `${dest}/${entry.name}`;
		Deno.copyFileSync(srcPath, destPath);
	}
}
