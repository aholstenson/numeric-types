import { AbstractDecimal } from './AbstractDecimal';

/**
 * Validate that the two supplied decimal instances are compatible.
 *
 * @param {AbstractDecimal} a
 * @param {AbstractDecimal} b
 */
export function validateCompatible<D extends AbstractDecimal<any>>(a: D, b: D) {
	if(! a || ! b) {
		throw new Error('Two decimal instances expected');
	}

	if(a.constructor !== b.constructor) {
		throw new Error('Both decimal instances need to be of same type');
	}
}
