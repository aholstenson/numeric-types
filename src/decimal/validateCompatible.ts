import { BaseDecimal } from './decimal-base';

/**
 * Validate that the two supplied decimal instances are compatible.
 *
 * @param {BaseDecimal} a
 * @param {BaseDecimal} b
 */
export function validateCompatible<C, D extends BaseDecimal<C>>(a: D, b: D) {
	if(! a || ! b) {
		throw new Error('Two decimal instances expected');
	}

	if(a.constructor !== b.constructor) {
		throw new Error('Both decimal instances need to be of same type');
	}
}
