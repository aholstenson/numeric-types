import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

/**
 * Rescale the coefficent of the specified decimal.
 *
 * @param spi
 * @param a
 */
export function rescaleCoefficient<C, D extends BaseDecimal<C>>(spi: DecimalSPI<C, D>, a: D, exponent: number): C {

	const diff = Math.abs(exponent - a[EXPONENT]);
	const scale = spi.exponentiate(spi.TEN, spi.wrap(diff));
	if(exponent > a[EXPONENT]) {
		return spi.divide(a[COEFFICIENT], scale);
	} else {
		return spi.multiply(a[COEFFICIENT], scale);
	}
}
