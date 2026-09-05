import { MathError } from '../MathError.js';

import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';

/**
 * Raise an integer to a whole power given as a regular number.
 *
 * The exponent must not be negative, as a negative exponent describes a
 * fraction and not a whole number.
 *
 * @param a
 *   the number to raise
 * @param exponent
 *   the power to raise the number to
 */
export function pow<I extends AbstractInteger<any>>(a: I, exponent: number): I {
	if(! Number.isSafeInteger(exponent)) {
		throw new MathError('Exponent must be a safe whole number, got ' + exponent);
	}

	const spi = a[SPI];
	return spi.create(spi.ops.exponentiate(a[VALUE], spi.ops.fromNumber(exponent)));
}
