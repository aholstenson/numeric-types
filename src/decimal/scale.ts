import { AbstractDecimal } from './abstract-decimal';
import { SPI } from './ops/symbols';

import { MathContext } from '../context';
import { rescaleOp } from './ops/rescaling';

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
