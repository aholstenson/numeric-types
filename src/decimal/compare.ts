import { AbstractDecimal } from './AbstractDecimal';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';
import { compareOp } from './ops/compareOp';

/**
 * Compare two decimal numbers. Returns `0` if the numbers are equal, `-1`
 * if `a` is less than `b` and `1` if `a` is greater than `b`.
 *
 * @param a
 * @param b
 */
export function compare<D extends AbstractDecimal<any>>(a: D, b: D): -1 | 0 | 1 {
	validateCompatible(a, b);
	return compareOp(a[SPI], a, b);
}

/**
 * Get if the given decimal numbers are equal.
 *
 * @param a
 * @param b
 */
export function isEqual<D extends AbstractDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) === 0;
}

/**
 * Get if the first decimal number is less than the second one.
 *
 * @param a
 * @param b
 */
export function isLessThan<D extends AbstractDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) < 0;
}

/**
 * Get if the first decimal number is less than or equal to the second one.
 *
 * @param a
 * @param b
 */
export function isLessThanOrEqual<D extends AbstractDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) <= 0;
}

/**
 * Get if the first decimal number is greater than the second one.
 *
 * @param a
 * @param b
 */
export function isGreaterThan<D extends AbstractDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) > 0;
}

/**
 * Get if the first decimal number is greater than or equal to the second one.
 *
 * @param a
 * @param b
 */
export function isGreaterThanOrEqual<D extends AbstractDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) >= 0;
}
