import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { subtractOp } from './ops/subtract';

export function subtract<C, D extends BaseDecimal<C>>(a: D, b: D): D {
	validateCompatible(a, b);
	return subtractOp(a[SPI], a, b);
}
