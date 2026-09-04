import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';

import { MathContext } from '../MathContext.js';
import { divideOp } from './ops/divideOp.js';

/**
 * Divide a number with another one.
 *
 * @param a
 *   first number to divide
 * @param b
 *   number to divide by
 * @param context
 *   context with information about the requested scale and how to perform
 *   rounding
 */
export function divide<D extends AbstractDecimal<any>>(a: D, b: D, context: MathContext): D {
	validateCompatible(a, b);
	return divideOp(a[SPI], a, b, context);
}
