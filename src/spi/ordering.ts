/**
 * Build the comparisons that follow from a `compare` function.
 *
 * Both numeric families order their values with a single `compare`, and every
 * other comparison is the same expression over its result. They are written
 * once here, and each family exports the result of one call.
 *
 * @param compare
 *   function that returns `0` when the two values are equal, a negative number
 *   when the first value is smaller, and a positive number when it is larger
 */
export function derivedComparisons<T>(compare: (a: T, b: T) => -1 | 0 | 1) {
	return {
		/**
		 * Get if the two numbers are equal.
		 *
		 * @param a
		 * @param b
		 */
		isEqual<A extends T>(a: A, b: A): boolean {
			return compare(a, b) === 0;
		},

		/**
		 * Get if the first number is less than the second one.
		 *
		 * @param a
		 * @param b
		 */
		isLessThan<A extends T>(a: A, b: A): boolean {
			return compare(a, b) < 0;
		},

		/**
		 * Get if the first number is less than or equal to the second one.
		 *
		 * @param a
		 * @param b
		 */
		isLessThanOrEqual<A extends T>(a: A, b: A): boolean {
			return compare(a, b) <= 0;
		},

		/**
		 * Get if the first number is greater than the second one.
		 *
		 * @param a
		 * @param b
		 */
		isGreaterThan<A extends T>(a: A, b: A): boolean {
			return compare(a, b) > 0;
		},

		/**
		 * Get if the first number is greater than or equal to the second one.
		 *
		 * @param a
		 * @param b
		 */
		isGreaterThanOrEqual<A extends T>(a: A, b: A): boolean {
			return compare(a, b) >= 0;
		},

		/**
		 * Get the smaller of two numbers. The first number is returned when the
		 * two are equal, which keeps the scale that it was written with.
		 *
		 * @param a
		 * @param b
		 */
		min<A extends T>(a: A, b: A): A {
			return compare(a, b) <= 0 ? a : b;
		},

		/**
		 * Get the larger of two numbers. The first number is returned when the
		 * two are equal, which keeps the scale that it was written with.
		 *
		 * @param a
		 * @param b
		 */
		max<A extends T>(a: A, b: A): A {
			return compare(a, b) >= 0 ? a : b;
		}
	};
}
