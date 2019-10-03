import { AbstractInteger } from './abstract-integer';
import { VALUE, SPI } from './ops/symbols';

/**
 * Perform a bitwise or between two integers.
 *
 * @param a
 * @param b
 */
export function bitwiseOr<I extends AbstractInteger<any>>(a: I, b: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];
	const r = spi.bitwiseOr(aValue, bValue);

	return spi.newInstance(r);
}
