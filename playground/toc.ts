export type TOC = {
	title: string;
	examples: string[];
}[];

export default [
	{
		title: 'Basics',
		examples: [
			'basic-map',
			'basic-style'
		]
	},
	{
		title: 'Adding Features',
		examples: [
			'add-marker',
			'add-geojson'
		]
	},
	{
		title: 'Adding UI Controls',
		examples: [
			'geocoder'
		]
	}
] as const satisfies TOC;
