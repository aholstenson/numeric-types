import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Get if an integer is zero.
 *
 * @param a
 */
export function isZero<I extends AbstractInteger<any>>(a: I): boolean {
	return a[SPI].ops.isZero(a[VALUE]);
}
