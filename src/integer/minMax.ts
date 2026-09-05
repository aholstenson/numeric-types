import { AbstractInteger } from './AbstractInteger.js';
import { compare } from './compare.js';

/**
 * Get the smaller of two integers. The first one is returned when they are
 * equal.
 *
 * @param a
 * @param b
 */
export function min<I extends AbstractInteger<any>>(a: I, b: I): I {
	return compare(a, b) <= 0 ? a : b;
}

/**
 * Get the larger of two integers. The first one is returned when they are
 * equal.
 *
 * @param a
 * @param b
 */
export function max<I extends AbstractInteger<any>>(a: I, b: I): I {
	return compare(a, b) >= 0 ? a : b;
}
