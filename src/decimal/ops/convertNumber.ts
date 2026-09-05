import { MathError } from '../../MathError.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { convertString } from './convertString.js';

export function convertNumber<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, n: number): D {
	if(typeof n !== 'number') {
		throw new MathError('Can only be used with a number, received object with type ' + typeof n);
	}

	if(! Number.isFinite(n)) {
		throw new MathError('Can only be used with a finite number, got ' + n);
	}

	if(Number.isSafeInteger(n)) {
		/*
		 * A whole number in the safe range is already a coefficient, so it is
		 * handed over as it is instead of being written and read back as a
		 * string. `-0` becomes `0`, as a coefficient carries no signed zero.
		 */
		return spi.create(spi.ops.fromNumber(n === 0 ? 0 : n), 0);
	}

	/*
	 * A number that is not whole has no exact short form. The string that
	 * JavaScript writes holds the digits that read back as the same value, so
	 * `0.1` stays `0.1` instead of becoming the much longer value that the
	 * binary form of the number really holds.
	 */
	return convertString(spi, n.toString());
}
