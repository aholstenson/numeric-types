import type { NumericOps } from '../../spi/NumericOps.js';

import { AbstractDecimal } from '../AbstractDecimal.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';

/**
 * Operation that converts a decimal into the nearest `number`.
 */
export function toNumberOp<C>(ops: NumericOps<C>, a: AbstractDecimal<C>): number {
	/*
	 * The number parser of JavaScript reads e-notation, so the coefficient and
	 * the exponent are handed over as they are. A large exponent therefore
	 * never builds the zeroes that the base-10 form would need.
	 */
	return Number(ops.toString(a[COEFFICIENT]) + 'e' + a[EXPONENT]);
}
