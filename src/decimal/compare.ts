import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';
import { compareOp } from './ops/compare';

export function compare<C, D extends BaseDecimal<C>>(a: D, b: D): number {
	validateCompatible(a, b);
	return compareOp(a[SPI], a, b);
}
