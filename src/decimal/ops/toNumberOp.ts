import { EXPONENT, COEFFICIENT } from './symbols.js';
import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

/**
 * Operation that converts a decimal into the nearest `number`.
 */
export function toNumberOp<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, a: D): number {
	/*
	 * The number parser of JavaScript reads e-notation, so the coefficient and
	 * the exponent are handed over as they are. A large exponent therefore
	 * never builds the zeroes that the base-10 form would need.
	 */
	return Number(spi.toString(a[COEFFICIENT]) + 'e' + a[EXPONENT]);
}
