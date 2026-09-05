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
	return spi.create(spi.ops.add(a[VALUE], b[VALUE]));
}
