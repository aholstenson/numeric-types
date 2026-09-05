import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

import { toStringOp } from './ops/toStringOp.js';

/**
 * Get the base-10 string of a decimal number, keeping every digit and the
 * scale that the number was written with.
 *
 * @param a
 */
export function toString<D extends AbstractDecimal<any>>(a: D): string {
	return toStringOp(a[SPI].ops, a);
}
