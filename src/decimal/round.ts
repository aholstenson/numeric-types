import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

import { rescaleOp } from './ops/rescalingOp.js';
import { MathContext } from '../MathContext.js';
import { RoundingMode } from '../RoundingMode.js';

/**
 * Round the given decimal number, optionally specifying the rounding mode to
 * use.
 *
 * @param a
 *   number to round
 * @param roundingMode
 *   the rounding mode to use, or HalfUp if not specified
 */
export function round<D extends AbstractDecimal<any>>(a: D, roundingMode?: RoundingMode): D {
	return rescaleOp(a[SPI], a, MathContext.ofScale(0, roundingMode ?? RoundingMode.HalfUp));
}
