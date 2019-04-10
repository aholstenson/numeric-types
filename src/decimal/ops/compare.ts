import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

import { rescaleCoefficient } from './rescaleCoefficient';

/**
 *
 * @param spi
 * @param a
 * @param b
 */
export function compareOp<C, D extends BaseDecimal<C>>(spi: DecimalSPI<C, D>, a: D, b: D): number {
	const aCoefficient = a[COEFFICIENT];
	const bCoefficient = b[COEFFICIENT];

	if(spi.isZero(aCoefficient) && spi.isZero(bCoefficient)) {
		// If both numbers are zero
		return 0;
	}

	const aNeg = spi.isNegative(aCoefficient);
	const bNeg = spi.isNegative(bCoefficient);

	if(aNeg !== bNeg) {
		if(aNeg) {
			return -1;
		} else {
			return 1;
		}
	}

	const baseExponent = Math.min(a[EXPONENT], b[EXPONENT]);
	const aScaledCoefficient = rescaleCoefficient(spi, a, baseExponent);
	const bScaledCoefficient = rescaleCoefficient(spi, b, baseExponent);

	return spi.compare(aScaledCoefficient, bScaledCoefficient);
}
