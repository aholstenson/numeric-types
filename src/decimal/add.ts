import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { addOp } from './ops/add';

/**
 * Add two decimal numbers together.
 */
export function add<C, D extends BaseDecimal<C>>(a: D, b: D): D {
	validateCompatible(a, b);
	return addOp(a[SPI], a, b);
}
