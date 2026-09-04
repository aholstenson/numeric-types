import { MathError } from '../../MathError.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { convertString } from './convertString.js';

export function convertNumber<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, n: number): D {
	if(typeof n !== 'number') {
		throw new MathError('Can only be used with a number, received object with type ' + typeof n);
	}

	// TODO: Deconstruct number into coefficient and exponent and use that input?

	return convertString(spi, n.toString());
}
