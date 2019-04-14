import { BaseDecimal } from './decimal-base';

export interface DecimalSPI<C, D extends BaseDecimal<C>> {

	DECIMAL_ZERO: D;
	DECIMAL_ONE: D;

	DEFAULT_EXPONENT: number;

	ONE: C;

	TEN: C;

	/**
	 * Create a new instance of the decimal.
	 *
	 * @param coefficient
	 *   the coefficient data
	 * @param exponent
	 *   exponents as number
	 */
	newInstance(coefficient: C, exponent: number): D;

	/**
	 * Check if the given value represents zero.
	 *
	 * @param a
	 */
	isZero(a: C): boolean;

	/**
	 * Get if one number is a multiple of another. Multiples are such numbers
	 * where the remainder of a division would be zero.
	 *
	 * @param a
	 *   number that should be a multiple of `b`
	 * @param b
	 *   number that should be fully divisible within `a`
	 */
	isMultipleOf(a: C, b: C): boolean;

	/**
	 * Get if the given number is negative.
	 *
	 * @param a
	 */
	isNegative(a: C): boolean;

	/**
	 * Get the first digit of the number. 100 would return 1, 2300 would be 2
	 * and so on.
	 *
	 * @param a
	 * @param position
	 */
	firstDigit(a: C): number;

	/**
	 * Compare two numbers. Returns `0` if the values are numerically equal,
	 * `-1` if `a` is less than `b` and `+1` if `a` is greater than `b`.
	 *
	 * @param a
	 * @param b
	 */
	compare(a: C, b: C): -1 | 0 | 1;

	/**
	 * Parse an integer turning it into a number.
	 *
	 * @param input
	 */
	parseInt(input: string): C;

	/**
	 * Convert the given number to a string containing its base-10
	 * representation.
	 */
	toString(a: C): string;

	/**
	 * Wrap a regular number into the opaque coefficient carrier.
	 *
	 * @param a
	 */
	wrap(a: number): C;

	/**
	 * Add two numbers together returning the result.
	 *
	 * @param a
	 * @param b
	 */
	add(a: C, b: C): C;

	/**
	 * Subtract the number `b` from `a`.
	 *
	 * @param a
	 *   the first number to be subtracted from
	 * @param b
	 *   the amount to subtract from the first number
	 */
	subtract(a: C, b: C): C;

	/**
	 * Multiply two numbers together.
	 *
	 * @param a
	 * @param b
	 */
	multiply(a: C, b: C): C;

	/**
	 * Divide the first number with a divisor `b`.
	 *
	 * @param a
	 * @param b
	 */
	divide(a: C, b: C): C;

	/**
	 * Get the remainder of a division between the two numbers.
	 *
	 * @param a
	 * @param b
	 */
	remainder(a: C, b: C): C;

	/**
	 * Exponentiate `a` with `b`.
	 *
	 * @param a
	 * @param b
	 */
	exponentiate(a: C, b: C): C;

	/**
	 * Get the absolute value of a number.
	 *
	 * @param a
	 */
	absolute(a: C): C;
}
