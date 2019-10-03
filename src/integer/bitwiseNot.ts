import { AbstractInteger } from './abstract-integer';
import { VALUE, SPI } from './ops/symbols';

/**
 * Perform a bitwise not on the integer.
 *
 * @param a
 */
export function bitwiseNot<I extends AbstractInteger<any>>(a: I): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const r = spi.bitwiseNot(aValue);

	return spi.newInstance(r);
}
