import { MathError } from '../MathError.js';

import { AbstractDecimal } from './AbstractDecimal.js';

/**
 * Validate that the two supplied decimal instances are compatible.
 *
 * @param {AbstractDecimal} a
 * @param {AbstractDecimal} b
 */
export function validateCompatible<D extends AbstractDecimal<any>>(a: D, b: D) {
	if(! a || ! b) {
		throw new MathError('Two decimal instances expected');
	}

	if(a.constructor !== b.constructor) {
		throw new MathError('Both decimal instances need to be of same type');
	}
}
