import { MathError } from '../MathError.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI } from './ops/symbols.js';

/**
 * Validate that the two supplied decimal instances are compatible.
 *
 * The types store their coefficient in different ways, so an operation that
 * mixes them would fail deep inside the engine. This check reports the problem
 * where it happens.
 *
 * @param a
 * @param b
 */
export function validateCompatible<D extends AbstractDecimal<any>>(a: D, b: D) {
	if(! (a instanceof AbstractDecimal) || ! (b instanceof AbstractDecimal)) {
		throw new MathError('Two decimal instances expected');
	}

	// Every instance of a type shares one SPI, so this compares the types.
	if(a[SPI] !== b[SPI]) {
		throw new MathError('Both decimal instances need to be of same type');
	}
}
