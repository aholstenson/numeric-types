import { AbstractDecimal } from '../AbstractDecimal';
import { DecimalSPI } from '../DecimalSPI';

import { EXPONENT, COEFFICIENT } from './symbols';

import { MathContext } from '../../MathContext';
import { rescaleCoefficientAndExponent } from './rescalingOp';

/**
 * Operation that multiplies two values with each other.
 *
 * @param {AbstractDecimal} a
 * @param {AbstractDecimal} b
 */
export function multiplyOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context?: MathContext
): D {
	const coefficient = spi.multiply(a[COEFFICIENT], b[COEFFICIENT]);
	const exponent = a[EXPONENT] + b[EXPONENT];

	return rescaleCoefficientAndExponent(spi, coefficient, exponent, context);
}
