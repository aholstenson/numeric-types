import { MathContext, hasScaleOrPrecision } from '../../MathContext.js';
import { MathError } from '../../MathError.js';
import { RoundingMode } from '../../RoundingMode.js';
import type { NumericOps } from '../../spi/NumericOps.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { round } from './round.js';

/**
 * Rescale the given number to the scale specified by the given math context.
 */
export function rescaleOp<C, D extends AbstractDecimal<C>>(
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
export function rescaleCoefficientAndExponent<C, D extends AbstractDecimal<C>>(
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
		return reduce(spi, coefficient, exponent);
	}

	const scaledExponent = calculateExponent(spi.ops, coefficient, exponent, context);
	const scaledCoefficient = rescaleCoefficient(spi.ops, coefficient, exponent, scaledExponent, context.roundingMode);

	return applyPrecision(spi, scaledCoefficient, scaledExponent, context);
}

/**
 * Remove trailing zeroes from a coefficient, raising the exponent for each
 * zero that is removed. The value does not change.
 */
export function reduce<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	coefficient: C,
	exponent: number
): D {
	// TODO: Potential optimization to reduce by several zeros at once

	const ops = spi.ops;

	let reducedCoefficient = coefficient;
	let reducedExponent = exponent;

	while(! ops.isZero(reducedCoefficient) && ops.isMultipleOf(reducedCoefficient, ops.TEN)) {
		reducedCoefficient = ops.divide(reducedCoefficient, ops.TEN);
		reducedExponent++;
	}

	return spi.create(reducedCoefficient, reducedExponent);
}

/**
 * Drop a digit if rounding pushed the number over the requested precision.
 *
 * Rounding `9.99` to a precision of two digits first gives `10.0`, which has
 * three digits. The extra digit is always a trailing zero, so removing it can
 * not round the value a second time.
 */
export function applyPrecision<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	coefficient: C,
	exponent: number,
	context: MathContext
): D {
	if(typeof context.scale !== 'undefined' || typeof context.precision === 'undefined') {
		return spi.create(coefficient, exponent);
	}

	const extra = spi.ops.digits(coefficient) - context.precision;
	if(extra <= 0) {
		return spi.create(coefficient, exponent);
	}

	const raisedExponent = exponent + extra;
	return spi.create(
		rescaleCoefficient(spi.ops, coefficient, exponent, raisedExponent, context.roundingMode),
		raisedExponent
	);
}

/**
 * Calculate the exponent to use when applying a math context to a specific
 * number.
 *
 * A context that sets a scale takes priority over one that sets a precision.
 *
 * @param ops
 * @param coefficient
 * @param exponent
 * @param context
 * @param defaultExponent
 */
export function calculateExponent<C>(
	ops: NumericOps<C>,
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
		validatePrecision(context.precision);

		if(ops.isZero(coefficient)) {
			// Zero has no significant digits to keep.
			return exponent;
		}

		/*
		 * Precision is an upper limit, so drop the digits that are in excess
		 * of it. A value that already has fewer digits is left alone, as
		 * padding it with zeroes would claim a precision that the value does
		 * not have.
		 */
		const excess = ops.digits(coefficient) - context.precision;
		return excess > 0 ? exponent + excess : exponent;
	} else if(typeof defaultExponent !== 'undefined') {
		return defaultExponent;
	} else {
		return exponent;
	}
}

/**
 * Check that a precision can be used, throwing a `MathError` if it can not.
 */
export function validatePrecision(precision: number) {
	if(! Number.isInteger(precision) || precision < 1) {
		throw new MathError('Precision must be a positive integer, got ' + precision);
	}
}

/**
 * Rescale the coefficient of the specified decimal.
 *
 * @param ops
 *   the arithmetic of the coefficient
 * @param coefficient
 *   the current coefficient
 * @param exponent
 *   the current exponent
 * @param newExponent
 *   the exponent to rescale to
 * @param roundingMode
 *   the rounding mode to use for the rescale
 */
export function rescaleCoefficient<C>(
	ops: NumericOps<C>,
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

	const scaleFactor = ops.exponentiate(ops.TEN, ops.fromNumber(diff));
	if(newExponent > exponent) {
		const scaledCoefficient = ops.divide(coefficient, scaleFactor);
		const scaledRemainder = ops.remainder(coefficient, scaleFactor);
		return round(ops, roundingMode, scaledCoefficient, scaledRemainder, scaleFactor);
	} else {
		return ops.multiply(coefficient, scaleFactor);
	}
}
