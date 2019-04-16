import { AbstractDecimal } from './abstract-decimal';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';

import { addOp } from './ops/add';
import { MathContext } from '../context';

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
