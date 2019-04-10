import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

import { MathContext } from '../../context';
import { round } from './rounding';

/**
 * Perform a reduction of the given decimal value.
 */
export function divideOp<C, D extends BaseDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	ctx: MathContext
): D {
	let coefficient = a[COEFFICIENT];
	let exponent = a[EXPONENT] - b[EXPONENT];

	let scaleExponent;
	if(typeof ctx.scale !== 'undefined') {
		scaleExponent = -ctx.scale;
	} else {
		scaleExponent = spi.DEFAULT_EXPONENT;
	}

	if(exponent > scaleExponent) {
		/*
		 * Expand the coefficient to match the scaled exponent.
		 */
		coefficient = spi.multiply(coefficient, spi.exponentiate(spi.TEN, spi.wrap(exponent - scaleExponent)));
		exponent = scaleExponent;
	}

	coefficient = spi.divide(coefficient, b[COEFFICIENT]);
	const remainder = spi.remainder(coefficient, b[COEFFICIENT]);

	coefficient = round(spi, ctx.roundingMode, coefficient, remainder);

	// Perform a reduction if using default exponent
	if(typeof ctx.scale === 'undefined') {
		while(! spi.isZero(coefficient) && spi.isMultipleOf(coefficient, spi.TEN)) {
			coefficient = spi.divide(coefficient, spi.TEN);
			exponent++;
		}
	}

	return spi.newInstance(coefficient, exponent);
}
