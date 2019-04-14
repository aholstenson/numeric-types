import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { multiplyOp } from './ops/multiply';
import { MathContext } from '../context';

export function multiply<D extends BaseDecimal<any>>(a: D, b: D, context?: MathContext) {
	validateCompatible(a, b);
	return multiplyOp(a[SPI], a, b, context);
}
