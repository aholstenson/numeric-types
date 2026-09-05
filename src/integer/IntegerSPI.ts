import type { IntegerOps } from '../spi/IntegerOps.js';

import type { AbstractInteger } from './AbstractInteger.js';

/**
 * What an integer type supplies to the operations: the arithmetic that its
 * value uses, and a way to build a new instance of the type.
 *
 * The arithmetic is shared, so an integer type only decides which one it uses.
 * `Integer` uses `numberOps` and `BigInteger` uses `bigIntOps`.
 */
export interface IntegerSPI<V, I extends AbstractInteger<V>> {

	/**
	 * The arithmetic that values of this type use.
	 */
	readonly ops: IntegerOps<V>;

	/**
	 * Create an instance of the type that holds the given value.
	 *
	 * @param value
	 */
	create(value: V): I;

	/**
	 * The value zero.
	 */
	readonly ZERO: I;

	/**
	 * The value one.
	 */
	readonly ONE: I;

	/**
	 * The value minus one.
	 */
	readonly MINUS_ONE: I;

	/**
	 * The value two.
	 */
	readonly TWO: I;

	/**
	 * The value ten, which is the base that decimal exponents use.
	 */
	readonly TEN: I;
}

/**
 * Build the SPI of an integer type from the two parts that it decides, which
 * are its arithmetic and its constructor. The constants follow from those two.
 *
 * @param ops
 *   the arithmetic that values use
 * @param create
 *   function that builds an instance from a value
 */
export function defineInteger<V, I extends AbstractInteger<V>>(
	ops: IntegerOps<V>,
	create: (value: V) => I
): IntegerSPI<V, I> {
	return {
		ops,
		create,

		ZERO: create(ops.ZERO),
		ONE: create(ops.ONE),
		MINUS_ONE: create(ops.negate(ops.ONE)),
		TWO: create(ops.TWO),
		TEN: create(ops.TEN)
	};
}
