import { AbstractDecimal } from '../AbstractDecimal';
import { DecimalSPI } from '../DecimalSPI';

import { MathContext } from '../../MathContext';

import { EXPONENT, COEFFICIENT } from './symbols';
import { rescaleCoefficientAndExponent } from './rescalingOp';

/**
 * Operation that subtract the decimal value b from a.
 *
 * @param {AbstractDecimal} a
 * @param {AbstractDecimal} b
 */
export function subtractOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context?: MathContext
): D {
	const aExp = a[EXPONENT];
	const bExp = b[EXPONENT];
	const diff = aExp - bExp;

	let coefficient;
	let exponent;
	if(diff === 0) {
		// The same exponent results a simple add between the coefficients
		coefficient = spi.subtract(a[COEFFICIENT], b[COEFFICIENT]);
		exponent = aExp;
	} else if(diff > 0) {
		// Need to align the coefficients and a's exponent is bigger
		const alignedA = spi.multiply(a[COEFFICIENT], spi.exponentiate(spi.TEN, spi.wrap(diff)));
		coefficient = spi.subtract(alignedA, b[COEFFICIENT]);
		exponent = bExp;
	} else {
		// Need to align the coefficients and b's exponent is bigger
		const alignedB = spi.multiply(b[COEFFICIENT], spi.exponentiate(spi.TEN, spi.wrap(-diff)));
		coefficient = spi.subtract(a[COEFFICIENT], alignedB);
		exponent = aExp;
	}

	return rescaleCoefficientAndExponent(spi, coefficient, exponent, context);
}
