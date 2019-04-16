import { AbstractDecimal } from '../abstract-decimal';
import { DecimalSPI } from '../decimal-spi';

import { EXPONENT, COEFFICIENT } from './symbols';
import { MathContext, hasScaleOrPrecision } from '../../context';

import { RoundingMode } from '../../rounding-mode';
import { round } from './rounding';

/**
 * Rescale the given number to the scale specified by the given math context.
 */
export function rescaleOp<C, D extends AbstractDecimal<any>>(
	spi: DecimalSPI<C, D>,
	a: D,
	context: MathContext
): D {
	return rescaleCoefficientAndExponent(spi, a[COEFFICIENT], a[EXPONENT], context);
}

/**
 * Rescale a number represented via coefficient and exponent to the scale
 * defined by the given math context.
 */
export function rescaleCoefficientAndExponent<C, D extends AbstractDecimal<any>>(
	spi: DecimalSPI<C, D>,
	coefficient: C,
	exponent: number,
	context?: MathContext
): D {
	if(typeof context === 'undefined' || ! hasScaleOrPrecision(context)) {
		/*
		 * No context specified so perform a reduction until no more zeroes
		 * can be removed.
		 */
		let scaledCoefficient = coefficient;
		let scaledExponent = exponent;
		while(! spi.isZero(scaledCoefficient) && spi.isMultipleOf(scaledCoefficient, spi.TEN)) {
			scaledCoefficient = spi.divide(coefficient, spi.TEN);
			scaledExponent++;
		}
		return spi.newInstance(scaledCoefficient, scaledExponent);
	} else {
		const scaledExponent = calculateExponent(spi, coefficient, exponent, context);
		const scaledCoefficient = rescaleCoefficient(spi, coefficient, exponent, scaledExponent, context.roundingMode);
		return spi.newInstance(scaledCoefficient, scaledExponent);
	}
}

/**
 * Calculate the exponent to use when applying a math context to a specific
 * number.
 *
 * @param spi
 * @param coefficient
 * @param exponent
 * @param context
 * @param defaultExponent
 */
export function calculateExponent<C, D extends AbstractDecimal<any>>(
	spi: DecimalSPI<C, D>,
	coefficient: C,
	exponent: number,
	context: MathContext,
	defaultExponent?: number
): number {
	if(typeof context.scale !== 'undefined') {
		/*
		 * The context indicates a specific scale. As scale is the number of
		 * digits after the dot, inverse it to an exponent. A scale of 2
		 * becomes the exponent -2 so that the value is calculated via
		 * coefficient * 10^-2.
		 */
		return - context.scale;
	} else if(typeof context.precision !== 'undefined') {
		throw new Error('No support for precision');
	} else if(typeof defaultExponent !== 'undefined') {
		return defaultExponent;
	} else {
		return exponent;
	}
}

/**
 * Rescale the coefficient of the specified decimal.
 *
 * @param spi
 * @param coefficient
 *   the current coefficient
 * @param exponent
 *   the current exponent
 * @param newExponent
 *   the exponent to rescale to
 * @param roundingMode
 *   the rounding mode to use for the rescale
 */
export function rescaleCoefficient<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	coefficient: C,
	exponent: number,
	newExponent: number,
	roundingMode: RoundingMode
): C {
	if(exponent === newExponent) {
		// If the exponents are the same no rescale is needed
		return coefficient;
	}

	const diff = Math.abs(newExponent - exponent);

	const scale = spi.exponentiate(spi.TEN, spi.wrap(diff));
	if(newExponent > exponent) {
		const scaledCoefficient = spi.divide(coefficient, scale);
		const scaledRemainder = spi.remainder(coefficient, scale);
		return round(spi, roundingMode, scaledCoefficient, scaledRemainder);
	} else {
		return spi.multiply(coefficient, scale);
	}
}
