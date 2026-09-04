import { BigInteger, remainder, compare, add, subtract, divide, multiply, exponentiate, unaryMinus } from '../integer/index.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import type { DecimalSPI } from './DecimalSPI.js';
import { SPI } from './ops/symbols.js';

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

	firstDigit(a) {
		// TODO: Faster algorithm for figuring out the first digit?
		return parseInt(a.toString()[0], 10);
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
		if(compare(a, ZERO) < 0) {
			return unaryMinus(a);
		}

		return a;
	}
};
