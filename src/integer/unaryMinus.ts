import { AbstractInteger } from './AbstractInteger.js';
import { negate } from './negate.js';

/**
 * Get the unary minus of the given integer. This is another name for
 * `negate`, which the decimal types use as well.
 *
 * @param a
 */
export function unaryMinus<I extends AbstractInteger<any>>(a: I): I {
	return negate(a);
}
