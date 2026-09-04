import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Multiply two integers together.
 *
 * @param a
 * @param b
 */
export function multiply<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.multiply(aValue, bValue);

	return spi.newInstance(r);
}
