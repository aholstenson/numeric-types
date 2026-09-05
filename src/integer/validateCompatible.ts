import { MathError } from '../MathError.js';

import { AbstractInteger } from './AbstractInteger.js';
import { SPI } from './ops/symbols.js';

/**
 * Validate that the two supplied integer instances can be used together.
 *
 * The types store their value in different ways, so an operation that mixes
 * them would fail deep inside the engine. This check reports the problem
 * where it happens.
 *
 * @param a
 * @param b
 */
export function validateCompatible<I extends AbstractInteger<any>>(a: I, b: I) {
	if(! (a instanceof AbstractInteger) || ! (b instanceof AbstractInteger)) {
		throw new MathError('Two integer instances expected');
	}

	// Every instance of a type shares one SPI, so this compares the types.
	if(a[SPI] !== b[SPI]) {
		throw new MathError('Both integer instances need to be of same type');
	}
}
