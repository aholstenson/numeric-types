import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Subtract the second integer from the first integer.
 *
 * @param a
 * @param b
 */
export function subtract<I extends AbstractInteger<any>>(a: I, b: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.subtract(aValue, bValue);

	return spi.newInstance(r);
}
