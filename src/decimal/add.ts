import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';

import { addOp } from './ops/addOp.js';
import { MathContext } from '../MathContext.js';

/**
 * Add two decimal numbers together.
 *
 * @param a
 *   the first number
 * @param b
 *   the second number
 * @param context
 *   optional context with information about scale/precision
 */
export function add<D extends AbstractDecimal<any>>(a: D, b: D, context?: MathContext): D {
	validateCompatible(a, b);
	return addOp(a[SPI], a, b, context);
}
