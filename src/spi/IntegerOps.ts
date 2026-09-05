import type { DerivedOps, NumericProvider } from './NumericOps.js';

/**
 * Arithmetic for a value that also supports bitwise operations.
 *
 * Decimal coefficients need only a `NumericProvider`, so the bitwise
 * operations live here and not in the base interface. The shifts and the
 * bitwise operations cover the full range of the type, and never the 32 bits
 * that the operators of JavaScript use on a `number`.
 */
export interface IntegerProvider<V> extends NumericProvider<V> {

	/**
	 * Perform a bitwise not, flipping every bit of the value.
	 *
	 * @param a
	 */
	bitwiseNot(a: V): V;

	/**
	 * Perform a bitwise and between two values.
	 *
	 * @param a
	 * @param b
	 */
	bitwiseAnd(a: V, b: V): V;

	/**
	 * Perform a bitwise or between two values.
	 *
	 * @param a
	 * @param b
	 */
	bitwiseOr(a: V, b: V): V;

	/**
	 * Shift a value left by the given number of bits.
	 *
	 * @param a
	 * @param amount
	 */
	leftShift(a: V, amount: number): V;

	/**
	 * Shift a value right by the given number of bits, keeping its sign.
	 *
	 * @param a
	 * @param amount
	 */
	signedRightShift(a: V, amount: number): V;
}

/**
 * Arithmetic that the integer types use, which is an `IntegerProvider`
 * together with everything that `deriveOps` adds to it.
 */
export type IntegerOps<V> = IntegerProvider<V> & DerivedOps<V>;
