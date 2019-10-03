import { AbstractInteger } from './AbstractInteger';
import { VALUE, SPI } from './ops/symbols';

/**
 * Get the remainder of a division of the first integer by the second integer.
 *
 * @param a
 * @param b
 */
export function remainder<I extends AbstractInteger<any>>(a: I, b: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.remainder(aValue, bValue);

	return spi.newInstance(r);
}
