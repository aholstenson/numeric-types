import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get the absolute value of the given integer.
 *
 * @param a
 */
export function abs<I extends AbstractInteger<any>>(a: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const r = spi.absolute(aValue);

	return spi.newInstance(r);
}
