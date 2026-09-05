import type { NumericOps } from '../spi/NumericOps.js';

import type { AbstractDecimal } from './AbstractDecimal.js';

/**
 * What a decimal type supplies to the operations: the arithmetic that its
 * coefficient uses, and a way to build a new instance of the type.
 *
 * A decimal is a whole coefficient and a base-10 exponent, so the arithmetic
 * it needs is the same arithmetic that the integer types use. `Decimal` uses
 * `numberOps` and `BigDecimal` uses `bigIntOps`.
 */
export interface DecimalSPI<C, D extends AbstractDecimal<C>> {

	/**
	 * The arithmetic that coefficients of this type use.
	 */
	readonly ops: NumericOps<C>;

	/**
	 * Create an instance of the type from a coefficient and an exponent. The
	 * value it describes is `coefficient * 10 ^ exponent`.
	 *
	 * @param coefficient
	 * @param exponent
	 */
	create(coefficient: C, exponent: number): D;

	/**
	 * The value zero, without digits after the decimal point.
	 */
	readonly ZERO: D;

	/**
	 * The value one, without digits after the decimal point.
	 */
	readonly ONE: D;

	/**
	 * The value minus one, without digits after the decimal point.
	 */
	readonly MINUS_ONE: D;

	/**
	 * The value two, without digits after the decimal point.
	 */
	readonly TWO: D;

	/**
	 * The value ten, without digits after the decimal point.
	 */
	readonly TEN: D;
}

/**
 * Build the SPI of a decimal type from the two parts that it decides, which
 * are the arithmetic of its coefficient and its constructor. The constants
 * follow from those two.
 *
 * @param ops
 *   the arithmetic that coefficients use
 * @param create
 *   function that builds an instance from a coefficient and an exponent
 */
export function defineDecimal<C, D extends AbstractDecimal<C>>(
	ops: NumericOps<C>,
	create: (coefficient: C, exponent: number) => D
): DecimalSPI<C, D> {
	return {
		ops,
		create,

		ZERO: create(ops.ZERO, 0),
		ONE: create(ops.ONE, 0),
		MINUS_ONE: create(ops.negate(ops.ONE), 0),
		TWO: create(ops.TWO, 0),
		TEN: create(ops.TEN, 0)
	};
}
