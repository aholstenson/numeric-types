import { AbstractDecimal } from './AbstractDecimal.js';
import { validateCompatible } from './validateCompatible.js';
import { SPI } from './ops/symbols.js';

import { MathContext } from '../MathContext.js';
import { remainderOp } from './ops/remainderOp.js';

/**
 * Get what remains after the number `a` is divided by the number `b`. The
 * division truncates towards zero, so the remainder carries the sign of `a`
 * and `10.5` divided by `3` leaves `1.5`.
 *
 * The result is exact, and a divisor of zero throws a `MathError`.
 *
 * @param a
 *   the number to divide
 * @param b
 *   the number to divide by
 * @param context
 *   optional context with information about scale/precision
 */
export function remainder<D extends AbstractDecimal<any>>(a: D, b: D, context?: MathContext): D {
	validateCompatible(a, b);
	return remainderOp(a[SPI], a, b, context);
}
