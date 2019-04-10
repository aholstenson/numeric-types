import { BaseDecimal } from './decimal-base';
import { SPI } from './ops/symbols';

import { toStringOp } from './ops/toString';

export function toString<C, D extends BaseDecimal<C>>(a: D): string {
	return toStringOp(a[SPI], a);
}
