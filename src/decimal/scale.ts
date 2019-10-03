import { AbstractDecimal } from './AbstractDecimal';
import { SPI } from './ops/symbols';

import { MathContext } from '../MathContext';
import { rescaleOp } from './ops/rescalingOp';

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
