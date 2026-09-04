import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';

import { multiplyOp } from './ops/multiplyOp.js';
import { MathContext } from '../MathContext.js';

export function multiply<D extends AbstractDecimal<any>>(a: D, b: D, context?: MathContext) {
	validateCompatible(a, b);
	return multiplyOp(a[SPI], a, b, context);
}
