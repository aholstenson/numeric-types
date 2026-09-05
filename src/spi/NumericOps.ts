/**
 * Arithmetic over whole numbers held in a value of type `V`, such as `number`
 * or `bigint`.
 *
 * A provider knows nothing about the classes that wrap the value, so one
 * provider supports several numeric types. `numberOps` is used both by
 * `Integer` and by the coefficient of `Decimal`, and `bigIntOps` both by
 * `BigInteger` and by the coefficient of `BigDecimal`.
 *
 * Every operation is exact. An operation that can not give an exact result
 * within the range of `V` throws a `MathError` instead of losing digits.
 *
 * A provider is the part that an implementation writes. Pass it to
 * `deriveOps` to get the `NumericOps` that the rest of the library uses, which
 * adds the members of `DerivedOps`.
 */
export interface NumericProvider<V> {

	/**
	 * Turn a `number` into a value. The number must be a whole number that the
	 * type can hold exactly.
	 *
	 * @param a
	 */
	fromNumber(a: number): V;

	/**
	 * Turn a string holding a base-10 whole number into a value. A string that
	 * describes something else, or a value that the type can not hold, throws
	 * a `MathError`.
	 *
	 * @param input
	 */
	parse(input: string): V;

	/**
	 * Get the nearest `number` to a value. Digits that a `number` can not hold
	 * are lost.
	 *
	 * @param a
	 */
	toNumber(a: V): number;

	/**
	 * Convert a value to a string holding its base-10 representation. The
	 * result never uses e-notation, as the digits are read back one by one.
	 *
	 * @param a
	 */
	toString(a: V): string;

	/**
	 * Get if a value is zero.
	 *
	 * @param a
	 */
	isZero(a: V): boolean;

	/**
	 * Get if a value is less than zero.
	 *
	 * @param a
	 */
	isNegative(a: V): boolean;

	/**
	 * Compare two values. Returns `0` if they are equal, `-1` if `a` is less
	 * than `b` and `1` if `a` is greater than `b`.
	 *
	 * @param a
	 * @param b
	 */
	compare(a: V, b: V): -1 | 0 | 1;

	/**
	 * Add two values together.
	 *
	 * @param a
	 * @param b
	 */
	add(a: V, b: V): V;

	/**
	 * Subtract the value `b` from the value `a`.
	 *
	 * @param a
	 *   the value to subtract from
	 * @param b
	 *   the value to subtract
	 */
	subtract(a: V, b: V): V;

	/**
	 * Multiply two values together.
	 *
	 * @param a
	 * @param b
	 */
	multiply(a: V, b: V): V;

	/**
	 * Divide the value `a` by the value `b`, truncating the result towards
	 * zero.
	 *
	 * @param a
	 * @param b
	 */
	divide(a: V, b: V): V;

	/**
	 * Get what remains after `a` is divided by `b`. The division truncates
	 * towards zero, so `divide` and `remainder` together satisfy
	 * `divide(a, b) * b + remainder(a, b) === a`.
	 *
	 * @param a
	 * @param b
	 */
	remainder(a: V, b: V): V;

	/**
	 * Raise the value `a` to the power `b`. A negative power describes a
	 * fraction, so it throws a `MathError`.
	 *
	 * @param a
	 * @param b
	 */
	exponentiate(a: V, b: V): V;

	/**
	 * Get a value with its sign flipped.
	 *
	 * @param a
	 */
	negate(a: V): V;
}

/**
 * The parts of `NumericOps` that follow from a `NumericProvider`. `deriveOps`
 * calculates them, so an implementation does not write them.
 */
export interface DerivedOps<V> {

	/**
	 * The value zero.
	 */
	readonly ZERO: V;

	/**
	 * The value one.
	 */
	readonly ONE: V;

	/**
	 * The value two.
	 */
	readonly TWO: V;

	/**
	 * The value ten, which is the base that decimal exponents use.
	 */
	readonly TEN: V;

	/**
	 * Get the absolute value of a value.
	 *
	 * @param a
	 */
	absolute(a: V): V;

	/**
	 * Get the number of digits in a value, ignoring its sign. `100` returns
	 * `3`, `-25` returns `2` and `0` returns `1`.
	 *
	 * @param a
	 */
	digits(a: V): number;

	/**
	 * Get if one value is a multiple of another one. Multiples are values
	 * where the remainder of a division is zero.
	 *
	 * @param a
	 *   value that should be a multiple of `b`
	 * @param b
	 *   value that should divide fully into `a`
	 */
	isMultipleOf(a: V, b: V): boolean;
}

/**
 * Arithmetic that the library uses, which is a `NumericProvider` together with
 * everything that `deriveOps` adds to it.
 */
export type NumericOps<V> = NumericProvider<V> & DerivedOps<V>;
