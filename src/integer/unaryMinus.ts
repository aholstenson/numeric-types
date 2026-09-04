import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get the unary minus of the given integer.
 *
 * @param a
 */
export function unaryMinus<I extends AbstractInteger<any>>(a: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const r = spi.unaryMinus(aValue);

	return spi.newInstance(r);
}
