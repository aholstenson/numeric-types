import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

import { EXPONENT, COEFFICIENT } from './symbols';

import { MathContext } from '../../context';
import { rescaleCoefficientAndExponent } from './rescaling';

/**
 * Operation that multiplies two values with each other.
 *
 * @param {BaseDecimal} a
 * @param {BaseDecimal} b
 */
export function multiplyOp<C, D extends BaseDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context?: MathContext
): D {
	const coefficient = spi.multiply(a[COEFFICIENT], b[COEFFICIENT]);
	const exponent = a[EXPONENT] + b[EXPONENT];

	return rescaleCoefficientAndExponent(spi, coefficient, exponent, context);
}
