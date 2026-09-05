import { MathError } from '../MathError.js';

import { AbstractInteger } from '../integer/AbstractInteger.js';
import { VALUE } from '../integer/ops/symbols.js';
import type { BigInteger } from '../integer/BigInteger.js';

import { bigIntOps } from '../spi/bigIntOps.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import type { Decimal } from './Decimal.js';
import { defineDecimal, type DecimalSPI } from './DecimalSPI.js';
import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

import { convertNumber } from './ops/convertNumber.js';
import { convertString } from './ops/convertString.js';

/**
 * Decimal implementation with near-unlimited precision. The coefficient is a
 * `bigint`, so the number of digits is limited only by the memory that is
 * available.
 */
export class BigDecimal extends AbstractDecimal<bigint> {
	public get [SPI](): DecimalSPI<bigint, this> {
		return spi as DecimalSPI<bigint, this>;
	}

	/**
	 * The value zero, without digits after the decimal point.
	 */
	public static get ZERO(): BigDecimal {
		return spi.ZERO;
	}

	/**
	 * The value one, without digits after the decimal point.
	 */
	public static get ONE(): BigDecimal {
		return spi.ONE;
	}

	/**
	 * The value minus one, without digits after the decimal point.
	 */
	public static get MINUS_ONE(): BigDecimal {
		return spi.MINUS_ONE;
	}

	/**
	 * The value two, without digits after the decimal point.
	 */
	public static get TWO(): BigDecimal {
		return spi.TWO;
	}

	/**
	 * The value ten, without digits after the decimal point.
	 */
	public static get TEN(): BigDecimal {
		return spi.TEN;
	}

	public static fromNumber(a: number): BigDecimal {
		return convertNumber(spi, a);
	}

	public static parse(input: string): BigDecimal {
		return convertString(spi, input);
	}

	/**
	 * Create a decimal from a `bigint`. The result has no digits after the
	 * decimal point.
	 */
	public static fromBigInt(a: bigint): BigDecimal {
		if(typeof a !== 'bigint') {
			throw new MathError('Can only be used with a bigint, received object with type ' + typeof a);
		}

		return new BigDecimal(a, 0);
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

		return new BigDecimal(BigInt(a[COEFFICIENT]), a[EXPONENT]);
	}

	/**
	 * Create a decimal from a `BigInteger`. The result has no digits after the
	 * decimal point.
	 */
	public static fromBigInteger(a: BigInteger): BigDecimal {
		/*
		 * Both integer types are an `AbstractInteger`, so the check looks at
		 * the value. Only `BigInteger` keeps that as a `bigint`.
		 */
		if(! (a instanceof AbstractInteger) || typeof a[VALUE] !== 'bigint') {
			throw new MathError('Expected a BigInteger');
		}

		return new BigDecimal(a[VALUE], 0);
	}
}

const spi = defineDecimal<bigint, BigDecimal>(
	bigIntOps,
	(coefficient, exponent) => new BigDecimal(coefficient, exponent)
);
