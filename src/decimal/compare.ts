import { derivedComparisons } from '../spi/ordering.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';
import { compareOp } from './ops/compareOp.js';

/**
 * Compare two decimal numbers. Returns `0` if the numbers are equal, `-1`
 * if `a` is less than `b` and `1` if `a` is greater than `b`.
 *
 * @param a
 * @param b
 */
export function compare<D extends AbstractDecimal<any>>(a: D, b: D): -1 | 0 | 1 {
	validateCompatible(a, b);
	return compareOp(a[SPI].ops, a, b);
}

export const {
	isEqual,
	isLessThan,
	isLessThanOrEqual,
	isGreaterThan,
	isGreaterThanOrEqual
} = derivedComparisons<AbstractDecimal<any>>(compare);
