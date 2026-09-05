import { MathError } from '../MathError.js';

import { checkSafe, fromBigInt, numberOps } from '../spi/numberOps.js';

import { AbstractInteger } from './AbstractInteger.js';
import type { BigInteger } from './BigInteger.js';
import type { IntegerSPI } from './IntegerSPI.js';
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

const spi: IntegerSPI<number, Integer> = {
	ops: numberOps,

	create(value) {
		return new Integer(value);
	}
};
