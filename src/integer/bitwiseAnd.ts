import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Perform a bitwise and operation between two integers.
 *
 * @param a
 * @param b
 */
export function bitwiseAnd<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];
	return spi.create(spi.ops.bitwiseAnd(a[VALUE], b[VALUE]));
}
