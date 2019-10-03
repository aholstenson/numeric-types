import { AbstractDecimal } from './AbstractDecimal';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { MathContext } from '../MathContext';
import { divideOp } from './ops/divideOp';

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
