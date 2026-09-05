import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Subtract the second integer from the first integer.
 *
 * @param a
 * @param b
 */
export function subtract<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];
	return spi.create(spi.ops.subtract(a[VALUE], b[VALUE]));
}
