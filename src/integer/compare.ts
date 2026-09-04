import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Compare two integers. Returns `0` if the numbers are equal, `-1` if `a` is
 * less than `b` and `1` if `a` is greater than `b`.
 *
 * @param a
 * @param b
 */
export function compare<I extends AbstractInteger<any>>(a: I, b: I): -1 | 0 | 1 {
	validateCompatible(a, b);

	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	return spi.compare(aValue, bValue);
}

/**
 * Get if the given integers are equal.
 *
 * @param a
 * @param b
 */
export function isEqual<D extends AbstractInteger<any>>(a: D, b: D): boolean {
	return compare(a, b) === 0;
}

/**
 * Get if the first integer is less than the second one.
 *
 * @param a
 * @param b
 */
export function isLessThan<D extends AbstractInteger<any>>(a: D, b: D): boolean {
	return compare(a, b) < 0;
}

/**
 * Get if the first integer is less than or equal to the second one.
 *
 * @param a
 * @param b
 */
export function isLessThanOrEqual<D extends AbstractInteger<any>>(a: D, b: D): boolean {
	return compare(a, b) <= 0;
}

/**
 * Get if the first integer is greater than the second one.
 *
 * @param a
 * @param b
 */
export function isGreaterThan<D extends AbstractInteger<any>>(a: D, b: D): boolean {
	return compare(a, b) > 0;
}

/**
 * Get if the first integer is greater than or equal to the second one.
 *
 * @param a
 * @param b
 */
export function isGreaterThanOrEqual<D extends AbstractInteger<any>>(a: D, b: D): boolean {
	return compare(a, b) >= 0;
}
