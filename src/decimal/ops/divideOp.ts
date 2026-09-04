import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { MathContext } from '../../MathContext.js';

import { round } from './round.js';
import { calculateExponent } from './rescalingOp.js';

/**
 * Perform a reduction of the given decimal value.
 */
export function divideOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context: MathContext
): D {
	let coefficient = a[COEFFICIENT];
	let exponent = a[EXPONENT] - b[EXPONENT];

	const scaleExponent = calculateExponent(spi, coefficient, a[EXPONENT], context, spi.DEFAULT_EXPONENT);

	if(exponent > scaleExponent) {
		/*
		 * Expand the coefficient to match the scaled exponent.
		 */
		coefficient = spi.multiply(coefficient, spi.exponentiate(spi.TEN, spi.wrap(exponent - scaleExponent)));
		exponent = scaleExponent;
	}

	coefficient = spi.divide(coefficient, b[COEFFICIENT]);
	const remainder = spi.remainder(coefficient, b[COEFFICIENT]);

	coefficient = round(spi, context.roundingMode, coefficient, remainder);

	// Perform a reduction if using default exponent
	if(typeof context.scale === 'undefined') {
		while(! spi.isZero(coefficient) && spi.isMultipleOf(coefficient, spi.TEN)) {
			coefficient = spi.divide(coefficient, spi.TEN);
			exponent++;
		}
	}

	return spi.newInstance(coefficient, exponent);
}
