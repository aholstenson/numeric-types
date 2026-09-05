import { MathError } from '../MathError.js';

import { bigIntOps } from '../spi/bigIntOps.js';

import { AbstractInteger } from './AbstractInteger.js';
import type { Integer } from './Integer.js';
import type { IntegerSPI } from './IntegerSPI.js';
import { SPI, VALUE } from './ops/symbols.js';

/**
 * Integer implementation that supports large numbers. Values are stored as
 * the built-in `bigint` type, so the range is limited only by the memory that
 * is available.
 */
export class BigInteger extends AbstractInteger<bigint> {
	public get [SPI](): IntegerSPI<bigint, this> {
		return spi as IntegerSPI<bigint, this>;
	}

	/**
	 * Create an integer from a number. The number must already be a whole
	 * number.
	 */
	public static fromNumber(a: number): BigInteger {
		return new BigInteger(bigIntOps.fromNumber(a));
	}

	/**
	 * Create an integer from a `bigint`.
	 */
	public static fromBigInt(a: bigint): BigInteger {
		if(typeof a !== 'bigint') {
			throw new MathError('Can only be used with a bigint, received object with type ' + typeof a);
		}

		return new BigInteger(a);
	}

	/**
	 * Create an integer from a string holding its base-10 representation.
	 */
	public static parse(input: string): BigInteger {
		return new BigInteger(bigIntOps.parse(input));
	}

	/**
	 * Create an integer from an `Integer`. Every `Integer` fits, so this
	 * conversion never fails.
	 */
	public static fromInteger(a: Integer): BigInteger {
		/*
		 * Both integer types are an `AbstractInteger`, so the check looks at
		 * the value. Only `Integer` keeps that as a `number`.
		 */
		if(! (a instanceof AbstractInteger) || typeof a[VALUE] !== 'number') {
			throw new MathError('Expected an Integer');
		}

		return new BigInteger(BigInt(a[VALUE]));
	}
}

const spi: IntegerSPI<bigint, BigInteger> = {
	ops: bigIntOps,

	create(value) {
		return new BigInteger(value);
	}
};
