import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Perform a bitwise or between two integers.
 *
 * @param a
 * @param b
 */
export function bitwiseOr<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];
	return spi.create(spi.ops.bitwiseOr(a[VALUE], b[VALUE]));
}
