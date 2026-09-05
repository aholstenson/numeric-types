import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { MathContext } from '../../MathContext.js';
import { MathError } from '../../MathError.js';
import { RoundingMode } from '../../RoundingMode.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { rescaleCoefficient, rescaleCoefficientAndExponent } from './rescalingOp.js';

/**
 * Operation that gets what remains after a division that truncates towards
 * zero.
 */
export function remainderOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context?: MathContext
): D {
	if(spi.isZero(b[COEFFICIENT])) {
		throw new MathError('Division by zero');
	}

	/*
	 * The remainder of `a / b` is exact, and it needs no more digits than the
	 * larger of the two scales. Both values are moved to that scale, which
	 * turns the operation into a remainder between two whole coefficients.
	 */
	const exponent = Math.min(a[EXPONENT], b[EXPONENT]);

	/*
	 * The target exponent is the smaller one, so both coefficients only grow
	 * and the rounding mode is never reached.
	 */
	const aCoefficient = rescaleCoefficient(spi, a[COEFFICIENT], a[EXPONENT], exponent, RoundingMode.Unnecessary);
	const bCoefficient = rescaleCoefficient(spi, b[COEFFICIENT], b[EXPONENT], exponent, RoundingMode.Unnecessary);

	const coefficient = spi.remainder(aCoefficient, bCoefficient);

	return rescaleCoefficientAndExponent(spi, coefficient, exponent, context);
}
