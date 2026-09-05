import { MathError } from '../MathError.js';

import { AbstractInteger } from './AbstractInteger.js';
import { VALUE, SPI } from './ops/symbols.js';
import { validateCompatible } from './validateCompatible.js';

/**
 * Get the remainder of a division of the first integer by the second integer.
 * The remainder carries the sign of the first integer.
 *
 * @param a
 * @param b
 */
export function remainder<I extends AbstractInteger<any>>(a: I, b: I): I {
	validateCompatible(a, b);

	const spi = a[SPI];
	const bValue = b[VALUE];

	if(spi.ops.isZero(bValue)) {
		throw new MathError('Division by zero');
	}

	return spi.create(spi.ops.remainder(a[VALUE], bValue));
}
