import { AbstractInteger } from './AbstractInteger';
import { VALUE, SPI } from './ops/symbols';

/**
 * Divide the first integer by the second integer.
 *
 * @param a
 * @param b
 */
export function divide<I extends AbstractInteger<any>>(a: I, b: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.divide(aValue, bValue);

	return spi.newInstance(r);
}
