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
}
