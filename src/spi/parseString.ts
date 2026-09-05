import { MathError } from '../MathError.js';

const PATTERN = /^[-+]?\d+$/;

/**
 * Check that a string describes a whole number, and return it without the
 * surrounding whitespace.
 *
 * Every implementation uses this, so that they accept and reject the same
 * input.
 *
 * @param input
 *   the string to check
 */
export function validateIntegerString(input: string): string {
	if(typeof input !== 'string') {
		throw new MathError('Can only be used with a string, received object with type ' + typeof input);
	}

	const trimmed = input.trim();
	if(! PATTERN.test(trimmed)) {
		throw new MathError('Invalid string, can not be converted to an integer, input was ' + input);
	}

	return trimmed;
}
