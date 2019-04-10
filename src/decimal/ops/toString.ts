import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

/**
 * Operation that converts a decimal into a base-10 string.
 */
export function toStringOp<C, D extends BaseDecimal<C>>(math: DecimalSPI<C, D>, a: D): string {
	const exponent = a[EXPONENT];
	const coefficient = a[COEFFICIENT];

	// Start with non-negative string representation
	let value = math.toString(math.absolute(coefficient));

	if(exponent > 0) {
		// A positive exponent means we need to zero-pad things
		// TODO: Support for e-notation?
		value = value + zeroes(exponent);
	} else if(exponent < 0) {
		// A negative exponent means we need to add back the decimal point
		let pointPosition = value.length + exponent;

		if(pointPosition <= 0) {
			/*
			 * String value is short - add zeroes so that the form becomes
			 * 0.VALUE, 0.00VALUE and so on.
			 */
			value = zeroes(1 - pointPosition) + value;
			pointPosition = 1;
		}

		value = value.substring(0, pointPosition) + '.' + value.substring(pointPosition);
	}

	// Check if a - needs to be added
	return math.isNegative(coefficient)
		? '-' + value
		: value;
}

const ZERO = '0';
function zeroes(count: number): string {
	return ZERO.repeat(count);
}
