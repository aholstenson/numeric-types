import { RoundingMode } from '../../RoundingMode.js';
import type { NumericOps } from '../../spi/NumericOps.js';

import { AbstractDecimal } from '../AbstractDecimal.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { rescaleCoefficient } from './rescalingOp.js';

/**
 * Operation that compares two decimals, ignoring the scale that they are
 * written with.
 *
 * @param ops
 *   the arithmetic of the coefficient
 * @param a
 * @param b
 */
export function compareOp<C>(ops: NumericOps<C>, a: AbstractDecimal<C>, b: AbstractDecimal<C>): -1 | 0 | 1 {
	const aCoefficient = a[COEFFICIENT];
	const bCoefficient = b[COEFFICIENT];

	if(ops.isZero(aCoefficient) && ops.isZero(bCoefficient)) {
		// If both numbers are zero
		return 0;
	}

	const aNeg = ops.isNegative(aCoefficient);
	const bNeg = ops.isNegative(bCoefficient);

	if(aNeg !== bNeg) {
		return aNeg ? -1 : 1;
	}

	const baseExponent = Math.min(a[EXPONENT], b[EXPONENT]);
	const aScaledCoefficient = rescaleCoefficient(ops, aCoefficient, a[EXPONENT], baseExponent, RoundingMode.Down);
	const bScaledCoefficient = rescaleCoefficient(ops, bCoefficient, b[EXPONENT], baseExponent, RoundingMode.Down);

	return ops.compare(aScaledCoefficient, bScaledCoefficient);
}
