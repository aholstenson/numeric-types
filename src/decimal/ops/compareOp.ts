import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';

import { rescaleCoefficient } from './rescalingOp.js';
import { RoundingMode } from '../../RoundingMode.js';

/**
 *
 * @param spi
 * @param a
 * @param b
 */
export function compareOp<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, a: D, b: D): -1 | 0 | 1 {
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
	const aScaledCoefficient = rescaleCoefficient(spi, aCoefficient, a[EXPONENT], baseExponent, RoundingMode.Down);
	const bScaledCoefficient = rescaleCoefficient(spi, bCoefficient, b[EXPONENT], baseExponent, RoundingMode.Down);

	return spi.compare(aScaledCoefficient, bScaledCoefficient);
}
