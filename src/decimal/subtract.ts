import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';

import { subtractOp } from './ops/subtractOp.js';
import { MathContext } from '../MathContext.js';

/**
 * Subtract a decimal number from another one.
 *
 * @param a
 *   the number to subtract from
 * @param b
 *   the number to subtract
 * @param context
 *   optional context with information about scale/precision
 */
export function subtract<D extends AbstractDecimal<any>>(a: D, b: D, context?: MathContext): D {
	validateCompatible(a, b);
	return subtractOp(a[SPI], a, b, context);
}
