import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

/**
 * Perform a reduction of the given decimal value.
 */
export function reduceOp<C, D extends BaseDecimal<C>>(math: DecimalSPI<C, D>, a: D): D {

	let coefficient = a[COEFFICIENT];
	let exponent = a[EXPONENT];

	// TODO: Potential optimization to reduce by several zeros at once

	while(! math.isZero(coefficient) && math.isMultipleOf(coefficient, math.TEN)) {
		coefficient = math.divide(coefficient, math.TEN);
		exponent++;
	}

	if(math.isZero(coefficient)) {
		// If the new result is zero - return the static value
		return math.DECIMAL_ZERO;
	}

	return math.newInstance(coefficient, exponent);
}
