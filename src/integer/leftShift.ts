import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Perform a left shift for the given number.
 *
 * @param a
 * @param amount
 */
export function leftShift<I extends AbstractInteger<any>>(a: I, amount: number): I {
	const spi = a[SPI];
	return spi.create(spi.ops.leftShift(a[VALUE], amount));
}
