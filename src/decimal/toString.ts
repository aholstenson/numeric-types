import { AbstractDecimal } from './AbstractDecimal';
import { SPI } from './ops/symbols';

import { toStringOp } from './ops/toStringOp';

export function toString<D extends AbstractDecimal<any>>(a: D): string {
	return toStringOp(a[SPI], a);
}
