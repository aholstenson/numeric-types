import { AbstractDecimal } from './abstract-decimal';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { multiplyOp } from './ops/multiply';
import { MathContext } from '../context';

export function multiply<D extends AbstractDecimal<any>>(a: D, b: D, context?: MathContext) {
	validateCompatible(a, b);
	return multiplyOp(a[SPI], a, b, context);
}
