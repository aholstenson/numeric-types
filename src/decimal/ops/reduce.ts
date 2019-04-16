import { EXPONENT, COEFFICIENT } from './symbols';
import { AbstractDecimal } from '../abstract-decimal';
import { DecimalSPI } from '../decimal-spi';

/**
 * Perform a reduction of the given decimal value.
 */
export function reduceOp<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, a: D): D {

	let coefficient = a[COEFFICIENT];
	let exponent = a[EXPONENT];

	// TODO: Potential optimization to reduce by several zeros at once

	while(! spi.isZero(coefficient) && spi.isMultipleOf(coefficient, spi.TEN)) {
		coefficient = spi.divide(coefficient, spi.TEN);
		exponent++;
	}

	if(spi.isZero(coefficient)) {
		// If the new result is zero - return the static value
		return spi.DECIMAL_ZERO;
	}

	return spi.newInstance(coefficient, exponent);
}
