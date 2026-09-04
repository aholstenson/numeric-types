import { MathError } from '../MathError.js';

import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Exponentiate the first integer with the second integer.
 *
 * The exponent must not be negative, as a negative exponent describes a
 * fraction and not a whole number.
 *
 * @param a
 * @param b
 */
export function exponentiate<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];

	if(spi.isNegative(bValue)) {
		throw new MathError('Exponent can not be negative, received: ' + spi.toString(bValue));
	}

	const r = spi.exponentiate(aValue, bValue);

	return spi.newInstance(r);
}
