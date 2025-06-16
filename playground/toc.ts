export type TOC = {
	title: string;
	examples: string[];
}[];

export default [
	{ title: 'Basics', examples: ['basic-map', 'basic-style'] },
	{ title: 'Adding Features', examples: ['add-marker'] }
] as const satisfies TOC;
