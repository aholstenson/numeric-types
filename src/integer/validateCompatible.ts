import { MathError } from '../MathError.js';

import { AbstractInteger } from './AbstractInteger.js';

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
	if(! a || ! b) {
		throw new MathError('Two integer instances expected');
	}

	if(a.constructor !== b.constructor) {
		throw new MathError('Both integer instances need to be of same type');
	}
}
