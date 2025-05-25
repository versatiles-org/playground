import { extractYaml } from '@std/front-matter';
import { render } from '@deno/gfm';

export interface Example {
	slug: string;
	title: string;
	description: string;
	body: string;
}

export function parseMarkdown(
	name: string,
	filePath: string,
): Example {
	const data = Deno.readTextFileSync(filePath);

	const { body, attrs } = extractYaml(data);

	const { title, description } = attrs as Record<string, unknown>;

	if (typeof title !== 'string') {
		throw new Error(`Title must be a string in YAML front matter of ${filePath}`);
	}

	if (typeof description !== 'string') {
		throw new Error(`Description must be a string in YAML front matter of ${filePath}`);
	}

	return {
		slug: name,
		title: title.trim(),
		description: description.trim(),
		body: render(body.trim(), {}),
	};
}
