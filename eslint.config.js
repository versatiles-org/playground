import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: [
			'docs/**',
			'node_modules/**',
			'playground/**',
			'eslint.config.js',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
];
