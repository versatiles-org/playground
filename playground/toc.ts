export type TOC = {
	title: string;
	examples: string[];
}[];

export default [{
	title: 'Basics',
	examples: ['simple-map', 'simple-style'],
}] as const satisfies TOC;
