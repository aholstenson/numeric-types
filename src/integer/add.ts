import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Add two integer numbers together.
 *
 * @param a
 * @param b
 */
export function add<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.add(aValue, bValue);

	return spi.newInstance(r);
}
