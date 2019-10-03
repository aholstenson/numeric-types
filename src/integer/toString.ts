import { AbstractInteger } from './AbstractInteger';
import { VALUE, SPI } from './ops/symbols';

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
