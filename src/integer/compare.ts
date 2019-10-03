import { AbstractInteger } from './abstract-integer';
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
