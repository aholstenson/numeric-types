import { MathContext } from '../../MathContext.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { rescaleCoefficientAndExponent } from './rescalingOp.js';

/**
 * Operation that adds two decimals together.
 *
 * @param a
 * @param b
 */
export function addOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context?: MathContext
): D {
	const ops = spi.ops;

	const aExp = a[EXPONENT];
	const bExp = b[EXPONENT];
	const diff = aExp - bExp;

	let coefficient;
	let exponent;
	if(diff === 0) {
		// The same exponent results a simple add between the coefficients
		coefficient = ops.add(a[COEFFICIENT], b[COEFFICIENT]);
		exponent = aExp;
	} else if(diff > 0) {
		// Need to align the coefficients and a's exponent is bigger
		const alignedA = ops.multiply(a[COEFFICIENT], ops.exponentiate(ops.TEN, ops.fromNumber(diff)));
		coefficient = ops.add(alignedA, b[COEFFICIENT]);
		exponent = bExp;
	} else {
		// Need to align the coefficients and b's exponent is bigger
		const alignedB = ops.multiply(b[COEFFICIENT], ops.exponentiate(ops.TEN, ops.fromNumber(-diff)));
		coefficient = ops.add(a[COEFFICIENT], alignedB);
		exponent = aExp;
	}

	return rescaleCoefficientAndExponent(spi, coefficient, exponent, context);
}
