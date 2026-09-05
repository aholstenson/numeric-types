import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

import { toNumberOp } from './ops/toNumberOp.js';

/**
 * Get the nearest `number` to a decimal number. Digits that a `number` can not
 * hold are lost, and a value that is too large becomes `Infinity`.
 *
 * @param a
 */
export function toNumber<D extends AbstractDecimal<any>>(a: D): number {
	return toNumberOp(a[SPI].ops, a);
}
