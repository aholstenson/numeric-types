import { AbstractDecimal } from './AbstractDecimal.js';
import { compare } from './compare.js';

/**
 * Get the smaller of two decimal numbers. Numbers that are numerically equal
 * can still be written with a different scale, and the first number is
 * returned in that case.
 *
 * @param a
 * @param b
 */
export function min<D extends AbstractDecimal<any>>(a: D, b: D): D {
	return compare(a, b) <= 0 ? a : b;
}

/**
 * Get the larger of two decimal numbers. Numbers that are numerically equal
 * can still be written with a different scale, and the first number is
 * returned in that case.
 *
 * @param a
 * @param b
 */
export function max<D extends AbstractDecimal<any>>(a: D, b: D): D {
	return compare(a, b) >= 0 ? a : b;
}
