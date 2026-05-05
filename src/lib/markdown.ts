import * as fs from 'node:fs';
import matter from 'gray-matter';
import { Marked } from 'marked';
import markedAlert from 'marked-alert';

const marked = new Marked().use(markedAlert());

export interface Example {
	slug: string;
	title: string;
	description: string;
	body: string;
}

export function parseMarkdown(name: string, filePath: string): Example {
	const data = fs.readFileSync(filePath, 'utf-8');
	const { content, data: attrs } = matter(data);

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
		body: marked.parse(content.trim()) as string,
	};
}
