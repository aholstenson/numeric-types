import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Return the string representation of an integer.
 *
 * @param a
 */
export function toString<I extends AbstractInteger<any>>(a: I): string {
	return a[SPI].ops.toString(a[VALUE]);
}
