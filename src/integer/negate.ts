import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get the given integer with its sign flipped.
 *
 * @param a
 */
export function negate<I extends AbstractInteger<any>>(a: I): I {
	const spi = a[SPI];
	return spi.create(spi.ops.negate(a[VALUE]));
}
