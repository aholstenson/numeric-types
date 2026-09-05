import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get the absolute value of the given integer.
 *
 * @param a
 */
export function abs<I extends AbstractInteger<any>>(a: I): I {
	const spi = a[SPI];
	return spi.create(spi.ops.absolute(a[VALUE]));
}
