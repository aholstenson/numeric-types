import { AbstractDecimal } from './AbstractDecimal';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { subtractOp } from './ops/subtractOp';

export function subtract<D extends AbstractDecimal<any>>(a: D, b: D): D {
	validateCompatible(a, b);
	return subtractOp(a[SPI], a, b);
}
