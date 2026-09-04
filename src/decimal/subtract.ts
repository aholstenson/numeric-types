import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';

import { subtractOp } from './ops/subtractOp.js';

export function subtract<D extends AbstractDecimal<any>>(a: D, b: D): D {
	validateCompatible(a, b);
	return subtractOp(a[SPI], a, b);
}
