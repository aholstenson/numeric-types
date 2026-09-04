import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [ 'dist', 'coverage' ]
	},

	js.configs.recommended,
	tseslint.configs.recommended,

	{
		rules: {
			// The SPI types are intentionally loose about their coefficient type.
			'@typescript-eslint/no-explicit-any': 'off',

			// The SPI lookup on `this.constructor` needs a suppression comment.
			'@typescript-eslint/ban-ts-comment': 'off',

			'prefer-const': 'warn',
			'no-console': 'error',
			'no-var': 'error',
			eqeqeq: [ 'error', 'always', { null: 'ignore' } ],
			quotes: [ 'error', 'single', { avoidEscape: true } ],
			semi: [ 'error', 'always' ],
			radix: 'error',
			'no-shadow': 'error'
		}
	}
);
