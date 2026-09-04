import { EXPONENT, COEFFICIENT } from './symbols.js';
import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { reduce } from './rescalingOp.js';

/**
 * Perform a reduction of the given decimal value, removing trailing zeroes
 * from its coefficient.
 */
export function reduceOp<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, a: D): D {
	const reduced = reduce(spi, a[COEFFICIENT], a[EXPONENT]);

	if(spi.isZero(reduced[COEFFICIENT])) {
		// If the new result is zero - return the static value
		return spi.DECIMAL_ZERO;
	}

	return reduced;
}
