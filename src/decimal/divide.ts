import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { MathContext } from '../context';
import { divideOp } from './ops/divide';

export function divide<C, D extends BaseDecimal<C>>(a: D, b: D, ctx: MathContext): D {
	validateCompatible(a, b);
	return divideOp(a[SPI], a, b, ctx);
}
