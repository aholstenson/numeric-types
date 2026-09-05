import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Perform a signed right shift for the given number.
 *
 * @param a
 * @param amount
 */
export function signedRightShift<I extends AbstractInteger<any>>(a: I, amount: number): I {
	const spi = a[SPI];
	return spi.create(spi.ops.signedRightShift(a[VALUE], amount));
}
