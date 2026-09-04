import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

import { toStringOp } from './ops/toStringOp.js';

export function toString<D extends AbstractDecimal<any>>(a: D): string {
	return toStringOp(a[SPI], a);
}
