import { AbstractDecimal } from './abstract-decimal';
import { SPI } from './ops/symbols';

import { rescaleOp } from './ops/rescaling';
import { RoundingMode } from '../rounding-mode';

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
	return rescaleOp(a[SPI], a, { scale: 0, roundingMode: roundingMode || RoundingMode.HalfUp });
}
