import { AbstractInteger } from './AbstractInteger.js';

/**
 * Service Provider Interface for supporting an integer implementation.
 */
export interface IntegerSPI<V, I extends AbstractInteger<V>> {
	/**
	 * Create a new instance of this integer type.
	 *
	 * @param value
	 *   the value
	 */
	newInstance(value: V): I;

	/**
	 * Add two numbers together.
	 *
	 * @param a
	 * @param b
	 */
	add(a: V, b: V): V;

	/*
	 * Subtract the second number from the first one.
	 */
	subtract(a: V, b: V): V;

	/**
	 * Multiply two numbers together.
	 *
	 * @param a
	 * @param b
	 */
	multiply(a: V, b: V): V;

	/**
	 * Divide the first number with the second one, truncating the result
	 * towards zero.
	 *
	 * @param a
	 * @param b
	 */
	divide(a: V, b: V): V;

	/**
	 * Get the remainder of a division of the first number by the second one.
	 * Equivalent to a % b, so the remainder carries the sign of `a`.
	 *
	 * @param a
	 * @param b
	 */
	remainder(a: V, b: V): V;

	/**
	 * Get if the given number is zero.
	 *
	 * @param a
	 */
	isZero(a: V): boolean;

	/**
	 * Get if the given number is negative.
	 *
	 * @param a
	 */
	isNegative(a: V): boolean;

	/**
	 * Exponentiate the first number with the second one.
	 *
	 * @param a
	 * @param b
	 */
	exponentiate(a: V, b: V): V;

	/**
	 * Get the unary minus of the number.
	 *
	 * @param a
	 */
	unaryMinus(a: V): V;

	/**
	 * Get the absolute value of the number.
	 *
	 * @param a
	 */
	absolute(a: V): V;

	/**
	 * Wrap a regular number into the value that this implementation uses.
	 *
	 * @param a
	 */
	wrap(a: number): V;

	/**
	 * Get the nearest `number` to the given value.
	 *
	 * @param a
	 */
	toNumber(a: V): number;

	/**
	 * Perform a bitwise not for the given number.
	 *
	 * @param a
	 */
	bitwiseNot(a: V): V;

	/**
	 * Left shift the given number.
	 *
	 * @param a
	 * @param b
	 */
	leftShift(a: V, b: number): V;

	/**
	 * Perform a signed right shift.
	 *
	 * @param a
	 * @param b
	 */
	signedRightShift(a: V, b: number): V;

	/**
	 * Perform a bitwise and between the two numbers.
	 *
	 * @param a
	 * @param b
	 */
	bitwiseAnd(a: V, b: V): V;

	/**
	 * Perform a bitwise or between the two numbers.
	 *
	 * @param a
	 * @param b
	 */
	bitwiseOr(a: V, b: V): V;

	/**
	 * Compare the two numbers.
	 *
	 * @param a
	 * @param b
	 */
	compare(a: V, b: V): -1 | 0 | 1;

	/**
	 * Turn this number into a string.
	 *
	 * @param a
	 */
	toString(a: V): string;
}
