import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { multiplyOp } from './ops/multiply';

export function multiply<C, D extends BaseDecimal<C>>(a: D, b: D) {
	validateCompatible(a, b);
	return multiplyOp(a[SPI], a, b);
}
