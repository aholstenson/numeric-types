import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI, COEFFICIENT } from './ops/symbols.js';

/**
 * Get the sign of a decimal number. Returns `-1` for a negative number, `0`
 * for zero and `1` for a positive number.
 *
 * @param a
 */
export function sign<D extends AbstractDecimal<any>>(a: D): -1 | 0 | 1 {
	const ops = a[SPI].ops;

	const coefficient = a[COEFFICIENT];
	if(ops.isZero(coefficient)) {
		return 0;
	}

	return ops.isNegative(coefficient) ? -1 : 1;
}
