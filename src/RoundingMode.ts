/**
 * Rounding mode for numeric operations.
 */
export enum RoundingMode {
	/**
	 * Round towards zero.
	 */
	Down = 1,

	/**
	 * Round away from zero.
	 */
	Up,

	/**
	 * Round towards the nearest neighbor, but if in the middle round away from zero.
	 *
	 * Examples: `0.1 => 0`, `0.5 => 1`, `0.6 => 1`, `-1.1 => 1`, `-1.5 => 2`, `-1.6 => `2`
	 */
	HalfUp,

	/**
	 * Round towards the nearest neighbor, but if in the middle round towards
	 * the even neighbor. Also known as bankers rounding.
	 *
	 * Examples: `0.1 => 0`, `0.5 => 0`, `0.6 => 1`, `-1.1 => 1`, `-1.5 => 2`, `-1.6 => `2`
	 */
	HalfEven,

	/**
	 * Round towards the nearest neighbor, but if in the middle round towards zero.
	 *
	 * Examples: `0.1 => 0`, `0.5 => 0`, `0.6 => 1`, `-1.1 => 1`, `-1.5 => 1`, `-1.6 => `2`
	 */
	HalfDown,

	/**
	 * Round towards negative infinity.
	 */
	Floor,

	/**
	 * Round towards positive infinity.
	 */
	Ceiling,

	/**
	 * Do not round, operation should have an exact result. Using this mode
	 * will result in errors being thrown if the result can not be exactly
	 * represented without rounding.
	 */
	Unnecessary
}
