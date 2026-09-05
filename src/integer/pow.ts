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

	if(exponent < 0) {
		throw new MathError('Exponent can not be negative, received: ' + exponent);
	}

	const spi = a[SPI];

	const aValue = a[VALUE];
	const r = spi.exponentiate(aValue, spi.wrap(exponent));

	return spi.newInstance(r);
}
