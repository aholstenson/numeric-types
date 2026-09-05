import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Exponentiate the first integer with the second integer.
 *
 * The exponent must not be negative, as a negative exponent describes a
 * fraction and not a whole number.
 *
 * @param a
 * @param b
 */
export function exponentiate<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];
	return spi.create(spi.ops.exponentiate(a[VALUE], b[VALUE]));
}
