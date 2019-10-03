import { AbstractInteger } from './abstract-integer';
import { VALUE, SPI } from './ops/symbols';

/**
 * Perform a left shift for the given number.
 *
 * @param a
 * @param amount
 */
export function leftShift<I extends AbstractInteger<any>>(a: I, amount: number): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const r = spi.leftShift(aValue, amount);

	return spi.newInstance(r);
}
