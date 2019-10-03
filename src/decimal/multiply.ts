import { AbstractDecimal } from './AbstractDecimal';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { multiplyOp } from './ops/multiplyOp';
import { MathContext } from '../MathContext';

export function multiply<D extends AbstractDecimal<any>>(a: D, b: D, context?: MathContext) {
	validateCompatible(a, b);
	return multiplyOp(a[SPI], a, b, context);
}
