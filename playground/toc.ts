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
			'add-geojson',
			'symbol-layer',
			'choropleth'
		]
	},
	{
		title: 'Adding UI Controls',
		examples: [
			'geocoder',
			'geolocate'
		]
	},
	{
		title: 'Other Data Sources',
		examples: [
			'satellite',
			'terrain'
		]
	}
] as const satisfies TOC;
