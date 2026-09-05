import { MathError } from '../MathError.js';

import { BigInteger, remainder, compare, add, subtract, divide, multiply, exponentiate, abs, negate } from '../integer/index.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import type { Decimal } from './Decimal.js';
import type { DecimalSPI } from './DecimalSPI.js';
import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

import { convertNumber } from './ops/convertNumber.js';
import { convertString } from './ops/convertString.js';

/**
 * Decimal implementation with near-unlimited precision.
 */
export class BigDecimal extends AbstractDecimal<BigInteger> {
	public static [SPI]: DecimalSPI<BigInteger, BigDecimal>;

	constructor(coefficent: BigInteger, exponent: number) {
		super(coefficent, exponent);
	}

	public static fromNumber(a: number): BigDecimal {
		return convertNumber(BigDecimal[SPI], a);
	}

	public static parse(input: string): BigDecimal {
		return convertString(BigDecimal[SPI], input);
	}

	/**
	 * Create a decimal from a `bigint`. The result has no digits after the
	 * decimal point.
	 */
	public static fromBigInt(a: bigint): BigDecimal {
		return new BigDecimal(BigInteger.fromBigInt(a), 0);
	}

	/**
	 * Create a decimal from a `Decimal`, keeping its scale. Every `Decimal`
	 * fits, so this conversion never fails.
	 */
	public static fromDecimal(a: Decimal): BigDecimal {
		/*
		 * Both decimal types are an `AbstractDecimal`, so the check looks at
		 * the coefficient. Only `Decimal` keeps that as a `number`.
		 */
		if(! (a instanceof AbstractDecimal) || typeof a[COEFFICIENT] !== 'number') {
			throw new MathError('Expected a Decimal');
		}

		return new BigDecimal(BigInteger.fromNumber(a[COEFFICIENT]), a[EXPONENT]);
	}

	/**
	 * Create a decimal from a `BigInteger`. The result has no digits after the
	 * decimal point.
	 */
	public static fromBigInteger(a: BigInteger): BigDecimal {
		if(! (a instanceof BigInteger)) {
			throw new MathError('Expected a BigInteger');
		}

		return new BigDecimal(a, 0);
	}
}

const ZERO = BigInteger.fromNumber(0);

BigDecimal[SPI] = {
	DECIMAL_ZERO: new BigDecimal(BigInteger.fromNumber(0), 0),

	DECIMAL_ONE: new BigDecimal(BigInteger.fromNumber(1), 0),

	ONE: BigInteger.fromNumber(1),

	TEN: BigInteger.fromNumber(10),

	DEFAULT_EXPONENT: -5,

	newInstance(coefficent, exponent) {
		return new BigDecimal(coefficent, exponent);
	},

	isZero(a) {
		return compare(a, ZERO) === 0;
	},

	isMultipleOf(a, b) {
		return compare(remainder(a, b), ZERO) === 0;
	},

	isNegative(a) {
		return compare(a, ZERO) < 0;
	},

	compare(a, b) {
		return compare(a, b);
	},

	parseInt(input) {
		return BigInteger.parse(input);
	},

	digits(a) {
		const value = a.toString();
		return value.charAt(0) === '-' ? value.length - 1 : value.length;
	},

	toString(a) {
		return a.toString();
	},

	wrap(a) {
		return BigInteger.fromNumber(a);
	},

	add(a, b) {
		return add(a, b);
	},

	subtract(a, b) {
		return subtract(a, b);
	},

	multiply(a, b) {
		return multiply(a, b);
	},

	divide(a, b) {
		return divide(a, b);
	},

	remainder(a, b) {
		return remainder(a, b);
	},

	exponentiate(a, b) {
		return exponentiate(a, b);
	},

	absolute(a) {
		return abs(a);
	},

	negate(a) {
		return negate(a);
	}
};
