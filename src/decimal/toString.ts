import { AbstractDecimal } from './abstract-decimal';
import { SPI } from './ops/symbols';

import { toStringOp } from './ops/toString';

export function toString<D extends AbstractDecimal<any>>(a: D): string {
	return toStringOp(a[SPI], a);
}
