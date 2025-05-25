export type TOC = {
	title: string;
	examples: string[];
}[];

export default [{
	title: 'Basics',
	examples: ['simple-map'],
}] as const satisfies TOC;
