import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

const PATTERN = /^([-\+]?\d+)(?:\.(\d*))?(?:e([-\+]?\d+))?$/;

/**
 * Operation that parses a string to a decimal.
 */
export function convertString<C, D extends BaseDecimal<C>>(math: DecimalSPI<C, D>, input: string): D {
	if(typeof input !== 'string') {
		throw new Error('Can only be used with a string, received object with type ' + typeof input);
	}

	const data = PATTERN.exec(input.trim());
	if(! data) {
		throw new Error('Invalid string, can not be converted to decimal, input was ' + input);
	}

	const integer = data[1];
	const fraction = data[2] || '';
	// The coefficient is the part before the dot combined with the fraction
	const coefficient = math.parseInt(integer + fraction);

	/*
	 * The exponent takes into account the e-part of the string and also
	 * removes the length of the fraction.
	 */
	let exponent = data[3] ? Number.parseInt(data[3], 10) : 0;
	exponent -= fraction.length;

	return math.newInstance(coefficient, exponent);
}
