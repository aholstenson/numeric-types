import { AbstractInteger } from './abstract-integer';
import { VALUE, SPI } from './ops/symbols';

/**
 * Perform a signed right shift for the given number.
 *
 * @param a
 * @param amount
 */
export function signedRightShift<I extends AbstractInteger<any>>(a: I, amount: number): I {
	const spi = a[SPI];

	const aValue = a[VALUE];
	const r = spi.signedRightShift(aValue, amount);

	return spi.newInstance(r);
}
