import { MathError } from '../MathError.js';

import { checkSafe, fromBigInt, numberOps } from '../spi/numberOps.js';

import { AbstractInteger } from './AbstractInteger.js';
import type { BigInteger } from './BigInteger.js';
import { defineInteger, type IntegerSPI } from './IntegerSPI.js';
import { SPI, VALUE } from './ops/symbols.js';

/**
 * Integer implementation for use with numbers within the range of
 * `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
 */
export class Integer extends AbstractInteger<number> {
	constructor(value: number) {
		super(checkSafe(value));
	}

	public get [SPI](): IntegerSPI<number, this> {
		return spi as IntegerSPI<number, this>;
	}

	/**
	 * The value zero.
	 */
	public static get ZERO(): Integer {
		return spi.ZERO;
	}

	/**
	 * The value one.
	 */
	public static get ONE(): Integer {
		return spi.ONE;
	}

	/**
	 * The value minus one.
	 */
	public static get MINUS_ONE(): Integer {
		return spi.MINUS_ONE;
	}

	/**
	 * The value two.
	 */
	public static get TWO(): Integer {
		return spi.TWO;
	}

	/**
	 * The value ten, which is the base that decimal exponents use.
	 */
	public static get TEN(): Integer {
		return spi.TEN;
	}

	/**
	 * Create an integer from a number. The number must already be a whole
	 * number within the safe range, as rounding it here would hide a mistake
	 * in the calling code.
	 */
	public static fromNumber(a: number): Integer {
		return new Integer(a);
	}

	/**
	 * Create an integer from a string holding its base-10 representation.
	 */
	public static parse(input: string): Integer {
		return new Integer(numberOps.parse(input));
	}

	/**
	 * Create an integer from a `BigInteger`.
	 *
	 * A `BigInteger` covers a larger range, so a value outside the safe range
	 * of `number` throws a `MathError` instead of losing its last digits.
	 */
	public static fromBigInteger(a: BigInteger): Integer {
		/*
		 * Both integer types are an `AbstractInteger`, so the check looks at
		 * the value. Only `BigInteger` keeps that as a `bigint`.
		 */
		if(! (a instanceof AbstractInteger) || typeof a[VALUE] !== 'bigint') {
			throw new MathError('Expected a BigInteger');
		}

		return new Integer(fromBigInt(a[VALUE]));
	}
}

const spi = defineInteger<number, Integer>(
	numberOps,
	value => new Integer(value)
);
