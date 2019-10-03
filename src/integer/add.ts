import { AbstractInteger } from './AbstractInteger';
import { VALUE, SPI } from './ops/symbols';

/**
 * Add two integer numbers together.
 *
 * @param a
 * @param b
 */
export function add<I extends AbstractInteger<any>>(a: I, b: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.add(aValue, bValue);

	return spi.newInstance(r);
}
