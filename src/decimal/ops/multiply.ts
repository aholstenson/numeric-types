import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

/**
 * Operation that multiplies two values with each other.
 *
 * @param {BaseDecimal} a
 * @param {BaseDecimal} b
 */
export function multiplyOp<C, D extends BaseDecimal<C>>(math: DecimalSPI<C, D>, a: D, b: D): D {
	const coefficient = math.multiply(a[COEFFICIENT], b[COEFFICIENT]);
	const exponent = a[EXPONENT] + b[EXPONENT];
	return math.newInstance(coefficient, exponent);
}
