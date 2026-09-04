import { MathError } from '../MathError.js';

import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Divide the first integer by the second integer. The result is truncated
 * towards zero, so `-7 / 2` is `-3`.
 *
 * @param a
 * @param b
 */
export function divide<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];

	const aValue = a[VALUE];
	const bValue = b[VALUE];

	if(spi.isZero(bValue)) {
		throw new MathError('Division by zero');
	}

	const r = spi.divide(aValue, bValue);

	return spi.newInstance(r);
}
