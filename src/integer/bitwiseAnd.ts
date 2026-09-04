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

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.bitwiseAnd(aValue, bValue);

	return spi.newInstance(r);
}
