import { MathError } from '../MathError.js';

import { AbstractInteger } from '../integer/AbstractInteger.js';
import { VALUE } from '../integer/ops/symbols.js';
import type { Integer } from '../integer/Integer.js';

import { checkSafe, fromBigInt, numberOps } from '../spi/numberOps.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import type { BigDecimal } from './BigDecimal.js';
import { defineDecimal, type DecimalSPI } from './DecimalSPI.js';
import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

import { convertNumber } from './ops/convertNumber.js';
import { convertString } from './ops/convertString.js';

/**
 * Decimal implementation with limited precision. The coefficient is a
 * `number`, so it holds the digits that fit within the safe range and a result
 * that needs more of them throws a `MathError`.
 */
export class Decimal extends AbstractDecimal<number> {
	constructor(coefficient: number, exponent: number) {
		super(checkSafe(coefficient), exponent);
	}

	public get [SPI](): DecimalSPI<number, this> {
		return spi as DecimalSPI<number, this>;
	}

	/**
	 * The value zero, without digits after the decimal point.
	 */
	public static get ZERO(): Decimal {
		return spi.ZERO;
	}

	/**
	 * The value one, without digits after the decimal point.
	 */
	public static get ONE(): Decimal {
		return spi.ONE;
	}

	/**
	 * The value minus one, without digits after the decimal point.
	 */
	public static get MINUS_ONE(): Decimal {
		return spi.MINUS_ONE;
	}

	/**
	 * The value two, without digits after the decimal point.
	 */
	public static get TWO(): Decimal {
		return spi.TWO;
	}

	/**
	 * The value ten, without digits after the decimal point.
	 */
	public static get TEN(): Decimal {
		return spi.TEN;
	}

	public static fromNumber(a: number): Decimal {
		return convertNumber(spi, a);
	}

	public static parse(input: string): Decimal {
		return convertString(spi, input);
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
		 * the coefficient. Only `BigDecimal` keeps that as a `bigint`.
		 */
		if(! (a instanceof AbstractDecimal) || typeof a[COEFFICIENT] !== 'bigint') {
			throw new MathError('Expected a BigDecimal');
		}

		return new Decimal(fromBigInt(a[COEFFICIENT]), a[EXPONENT]);
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

const spi = defineDecimal<number, Decimal>(
	numberOps,
	(coefficient, exponent) => new Decimal(coefficient, exponent)
);
