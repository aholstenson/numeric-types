import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI, COEFFICIENT } from './ops/symbols.js';

/**
 * Get the sign of a decimal number. Returns `-1` for a negative number, `0`
 * for zero and `1` for a positive number.
 *
 * @param a
 */
export function sign<D extends AbstractDecimal<any>>(a: D): -1 | 0 | 1 {
	const spi = a[SPI];

	const coefficient = a[COEFFICIENT];
	if(spi.isZero(coefficient)) {
		return 0;
	}

	return spi.isNegative(coefficient) ? -1 : 1;
}
