import { derivedComparisons } from '../spi/ordering.js';

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

	return a[SPI].ops.compare(a[VALUE], b[VALUE]);
}

export const {
	isEqual,
	isLessThan,
	isLessThanOrEqual,
	isGreaterThan,
	isGreaterThanOrEqual
} = derivedComparisons<AbstractInteger<any>>(compare);
