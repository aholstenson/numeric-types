import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

import { MathContext } from '../MathContext.js';
import { rescaleOp } from './ops/rescalingOp.js';

/**
 * Scale the given decimal number using the rules outlined by the context.
 *
 * @param a
 *   number to scale
 * @param context
 *   context to use for scale
 */
export function scale<D extends AbstractDecimal<any>>(a: D, context: MathContext): D {
	return rescaleOp(a[SPI], a, context);
}
