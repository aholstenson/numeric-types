import { MathError } from '../MathError.js';

import { AbstractInteger } from '../integer/AbstractInteger.js';
import { VALUE } from '../integer/ops/symbols.js';
import type { Integer } from '../integer/Integer.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import type { BigDecimal } from './BigDecimal.js';
import type { DecimalSPI } from './DecimalSPI.js';
import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

import { convertNumber } from './ops/convertNumber.js';
import { convertString } from './ops/convertString.js';

/**
 * Decimal implementation with limited precision.
 */
export class Decimal extends AbstractDecimal<number> {
	public static [SPI]: DecimalSPI<number, Decimal>;

	constructor(coefficent: number, exponent: number) {
		checkSafe(coefficent);

		super(coefficent, exponent);
	}

	public static fromNumber(a: number): Decimal {
		return convertNumber(Decimal[SPI], a);
	}

	public static parse(input: string): Decimal {
		return convertString(Decimal[SPI], input);
	}

	/**
	 * Create a decimal from a `BigDecimal`, keeping its scale.
	 *
	 * A `BigDecimal` can hold more digits than a `Decimal`, so a value that
	 * needs too many of them throws a `MathError` instead of losing digits.
	 * Use `scale` or `round` on the `BigDecimal` first if the value is allowed
	 * to lose digits.
	 */
	public static fromBigDecimal(a: BigDecimal): Decimal {
		/*
		 * Both decimal types are an `AbstractDecimal`, so the check looks at
		 * the coefficient. Only `Decimal` keeps that as a `number`.
		 */
		if(! (a instanceof AbstractDecimal) || typeof a[COEFFICIENT] === 'number') {
			throw new MathError('Expected a BigDecimal');
		}

		return new Decimal(a[COEFFICIENT].toNumber(), a[EXPONENT]);
	}

	/**
	 * Create a decimal from an `Integer`. The result has no digits after the
	 * decimal point.
	 */
	public static fromInteger(a: Integer): Decimal {
		if(! (a instanceof AbstractInteger) || typeof a[VALUE] !== 'number') {
			throw new MathError('Expected an Integer');
		}

		return new Decimal(a[VALUE], 0);
	}
}

/**
 * Check that a value is still exact, and return it.
 *
 * A `number` silently drops digits above `Number.MAX_SAFE_INTEGER`, and the
 * dropped digits can turn into trailing zeroes that later steps remove. The
 * check therefore runs on every result that can grow, and not only on the
 * coefficient that reaches the constructor.
 */
function checkSafe(a: number): number {
	if(! Number.isSafeInteger(a)) {
		throw new MathError('Coefficient is not a safe integer, got ' + a);
	}

	return a;
}

Decimal[SPI] = {
	DECIMAL_ZERO: new Decimal(0, 0),

	DECIMAL_ONE: new Decimal(1, 0),

	ONE: 1,

	TEN: 10,

	DEFAULT_EXPONENT: -5,

	newInstance(coefficent, exponent) {
		return new Decimal(coefficent, exponent);
	},

	isZero(a) {
		return a === 0;
	},

	isMultipleOf(a, b) {
		return a % b === 0;
	},

	isNegative(a) {
		return a < 0;
	},

	compare(a, b) {
		return a === b ? 0 : (a < b ? -1 : 1);
	},

	parseInt(input) {
		return parseInt(input, 10);
	},

	digits(a) {
		/*
		 * Safe integers never use e-notation in their string form, so the
		 * length of the string is the digit count.
		 */
		return Math.abs(a).toString().length;
	},

	toString(a) {
		return a.toString();
	},

	wrap(a) {
		return a;
	},

	add(a, b) {
		return checkSafe(a + b);
	},

	subtract(a, b) {
		return checkSafe(a - b);
	},

	multiply(a, b) {
		return checkSafe(a * b);
	},

	divide(a, b) {
		/*
		 * Truncate towards zero, so that the quotient and the remainder from
		 * `%` describe the same division.
		 */
		return Math.trunc(a / b);
	},

	remainder(a, b) {
		return a % b;
	},

	exponentiate(a, b) {
		return checkSafe(Math.pow(a, b));
	},

	absolute(a) {
		return Math.abs(a);
	},

	negate(a) {
		// A safe integer stays safe when its sign is flipped.
		return -a;
	}
} as DecimalSPI<number, Decimal>;
