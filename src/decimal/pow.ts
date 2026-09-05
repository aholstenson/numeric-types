import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

import { MathContext } from '../MathContext.js';
import { powOp } from './ops/powOp.js';

/**
 * Raise a decimal number to a whole power.
 *
 * A power of zero or more is exact. A negative power is a division, so it
 * needs a context that says how many digits to keep.
 *
 * @param a
 *   the number to raise
 * @param exponent
 *   the power to raise the number to, as a whole number
 * @param context
 *   optional context with information about scale/precision, required when the
 *   exponent is negative
 */
export function pow<D extends AbstractDecimal<any>>(a: D, exponent: number, context?: MathContext): D {
	return powOp(a[SPI], a, exponent, context);
}
