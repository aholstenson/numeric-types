import { AbstractInteger } from './AbstractInteger';
import { VALUE, SPI } from './ops/symbols';

/**
 * Exponentiate the first integer with the second integer.
 *
 * @param a
 * @param b
 */
export function exponentiate<I extends AbstractInteger<any>>(a: I, b: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.exponentiate(aValue, bValue);

	return spi.newInstance(r);
}
