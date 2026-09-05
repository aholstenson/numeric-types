import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get the sign of an integer. Returns `-1` for a negative number, `0` for zero
 * and `1` for a positive number.
 *
 * @param a
 */
export function sign<I extends AbstractInteger<any>>(a: I): -1 | 0 | 1 {
	const spi = a[SPI];

	const aValue = a[VALUE];
	if(spi.isZero(aValue)) {
		return 0;
	}

	return spi.isNegative(aValue) ? -1 : 1;
}
