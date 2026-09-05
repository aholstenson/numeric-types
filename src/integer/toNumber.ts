import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get the nearest `number` to an integer. A value outside the safe range of
 * `number` loses digits.
 *
 * @param a
 */
export function toNumber<I extends AbstractInteger<any>>(a: I): number {
	return a[SPI].ops.toNumber(a[VALUE]);
}
