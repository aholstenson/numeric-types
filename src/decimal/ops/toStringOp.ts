import type { NumericOps } from '../../spi/NumericOps.js';

import { AbstractDecimal } from '../AbstractDecimal.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';

/*
 * Limits that decide when the plain base-10 form gives way to e-notation.
 * They are the limits that `Number.prototype.toString` uses, so a decimal is
 * written in the same form as the `number` with the same value would be. The
 * limits also keep a large exponent from building a very long string, as
 * `1e1000000` is written with its exponent instead of a million zeroes.
 *
 * Both limits apply to the position of the decimal point, counted from the
 * start of the digits. `12.34` has its point at position 2 and `0.00012` at
 * position -3.
 */
const MAX_POINT_POSITION = 21;
const MIN_POINT_POSITION = -5;

/**
 * Operation that converts a decimal into a base-10 string. The result is
 * either the plain form, such as `120` or `0.005`, or e-notation, such as
 * `1.2e+30`. Both forms keep every digit of the value and its scale, so the
 * string reads back as the same decimal.
 */
export function toStringOp<C>(ops: NumericOps<C>, a: AbstractDecimal<C>): string {
	const exponent = a[EXPONENT];
	const coefficient = a[COEFFICIENT];

	// Start with non-negative string representation
	const digits = ops.toString(ops.absolute(coefficient));

	/*
	 * Where the decimal point falls within the digits. A position larger than
	 * the number of digits needs zero-padding at the end, and a position that
	 * is zero or less needs zeroes between the point and the digits.
	 */
	const pointPosition = digits.length + exponent;

	let value;
	if(pointPosition > MAX_POINT_POSITION || pointPosition < MIN_POINT_POSITION) {
		/*
		 * The plain form would need a lot of zeroes, so the value is written
		 * with a single digit before the point and the rest of the digits
		 * after it, followed by the exponent that form needs.
		 */
		const mantissa = digits.length > 1
			? digits[0] + '.' + digits.substring(1)
			: digits;

		const scientificExponent = pointPosition - 1;
		value = mantissa + 'e'
			+ (scientificExponent < 0 ? '-' : '+')
			+ Math.abs(scientificExponent);
	} else if(pointPosition <= 0) {
		/*
		 * The digits are all after the point, so the form becomes 0.VALUE,
		 * 0.00VALUE and so on.
		 */
		value = '0.' + zeroes(-pointPosition) + digits;
	} else if(pointPosition >= digits.length) {
		// The point falls after the digits, so the value is zero-padded
		value = digits + zeroes(pointPosition - digits.length);
	} else {
		// The point falls within the digits
		value = digits.substring(0, pointPosition) + '.' + digits.substring(pointPosition);
	}

	// Check if a - needs to be added
	return ops.isNegative(coefficient)
		? '-' + value
		: value;
}

const ZERO = '0';
function zeroes(count: number): string {
	return ZERO.repeat(count);
}
