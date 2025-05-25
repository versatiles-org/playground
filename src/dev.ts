import { serveDir } from '@std/http/file-server';

import './generate.ts';

const fsRoot = (new URL('../docs', import.meta.url)).pathname;

Deno.serve((req: Request) => {
	if (req.method !== 'GET') return ignore();
	if (/\.icp$/.test(req.url)) return ignore();

	return serveDir(req, { fsRoot, urlRoot: '', quiet: true });

	function ignore() {
		return new Response('ignore', { status: 404 });
	}
});
