export type TOC = {
	title: string;
	examples: string[];
}[];

export default [
	{ title: 'Basics', examples: ['basic-map', 'basic-style'] }
] as const satisfies TOC;
