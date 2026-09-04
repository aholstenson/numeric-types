import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Return the string representation of an integer.
 *
 * @param a
 */
export function toString<I extends AbstractInteger<any>>(a: I): string {
	const spi = a[SPI];

	const aValue = a[VALUE];
	return spi.toString(aValue);
}
