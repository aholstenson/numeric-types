import { MathContext, hasScaleOrPrecision, DEFAULT_DIVISION_SCALE } from '../../MathContext.js';
import { MathError } from '../../MathError.js';
import { RoundingMode } from '../../RoundingMode.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { round } from './round.js';
import { applyPrecision, reduce, validatePrecision } from './rescalingOp.js';

/**
 * Divide a decimal value by another one.
 *
 * The context decides how many digits the result keeps. Without a scale or a
 * precision the result is calculated at the default scale and then reduced.
 */
export function divideOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context: MathContext
): D {
	const ops = spi.ops;

	if(ops.isZero(b[COEFFICIENT])) {
		throw new MathError('Division by zero');
	}

	if(ops.isZero(a[COEFFICIENT])) {
		/*
		 * Zero divided by any number is zero, but the result still has to
		 * carry the scale that was asked for.
		 */
		return typeof context.scale === 'undefined'
			? spi.ZERO
			: spi.create(ops.ZERO, - context.scale);
	}

	const exponent = calculateDivisionExponent(spi, a, b, context);
	const result = divideAtExponent(spi, a, b, exponent, context.roundingMode);

	if(! hasScaleOrPrecision(context)) {
		// The default scale leaves trailing zeroes that carry no meaning.
		return reduce(spi, result.coefficient, exponent);
	}

	if(typeof context.scale === 'undefined' && result.exact) {
		/*
		 * Precision is an upper limit. An exact result needs no placeholder
		 * digits to reach it.
		 */
		return reduce(spi, result.coefficient, exponent);
	}

	return applyPrecision(spi, result.coefficient, exponent, context);
}

/**
 * Find the exponent that the result of a division should use.
 */
function calculateDivisionExponent<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	context: MathContext
): number {
	if(typeof context.scale !== 'undefined') {
		return - context.scale;
	}

	if(typeof context.precision === 'undefined') {
		return - DEFAULT_DIVISION_SCALE;
	}

	validatePrecision(context.precision);

	const ops = spi.ops;

	/*
	 * A value sits between `10^(magnitude-1)` and `10^magnitude`, where the
	 * magnitude is the exponent plus the digit count. The magnitude of a
	 * quotient is the difference between the two magnitudes, or one more
	 * than that.
	 */
	const magnitude = (a[EXPONENT] + ops.digits(a[COEFFICIENT]))
		- (b[EXPONENT] + ops.digits(b[COEFFICIENT]));

	const estimate = magnitude - context.precision;

	/*
	 * Divide once without rounding to measure the real digit count. The
	 * result of this division is discarded, so the value is never rounded
	 * twice.
	 */
	const trial = divideAtExponent(spi, a, b, estimate, RoundingMode.Down).coefficient;
	if(ops.isZero(trial)) {
		return estimate;
	}

	return estimate + ops.digits(trial) - context.precision;
}

/**
 * The coefficient of a division, and whether the division came out exact.
 */
interface DivisionResult<C> {
	coefficient: C;
	exact: boolean;
}

/**
 * Divide `a` by `b` and return the coefficient of the result at the given
 * exponent.
 *
 * The division is set up so that a single division and a single rounding
 * produce the result.
 */
function divideAtExponent<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	b: D,
	exponent: number,
	roundingMode: RoundingMode
): DivisionResult<C> {
	const ops = spi.ops;

	/*
	 * `a / b` is `(ca / cb) * 10^(ea - eb)`. To land on the requested
	 * exponent the difference has to be moved into the fraction, either by
	 * growing the numerator or by growing the denominator.
	 */
	const shift = a[EXPONENT] - b[EXPONENT] - exponent;

	let numerator = a[COEFFICIENT];
	let denominator = b[COEFFICIENT];

	if(shift > 0) {
		numerator = ops.multiply(numerator, ops.exponentiate(ops.TEN, ops.fromNumber(shift)));
	} else if(shift < 0) {
		denominator = ops.multiply(denominator, ops.exponentiate(ops.TEN, ops.fromNumber(-shift)));
	}

	const quotient = ops.divide(numerator, denominator);
	const remainder = ops.remainder(numerator, denominator);

	return {
		coefficient: round(ops, roundingMode, quotient, remainder, denominator),
		exact: ops.isZero(remainder)
	};
}
