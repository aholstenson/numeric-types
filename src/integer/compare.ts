import { AbstractInteger } from './AbstractInteger';
import { VALUE, SPI } from './ops/symbols';

/**
 * Compare two integers.
 *
 * @param a
 * @param b
 */
export function compare<I extends AbstractInteger<any>>(a: I, b: I): -1 | 0 | 1 {
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
