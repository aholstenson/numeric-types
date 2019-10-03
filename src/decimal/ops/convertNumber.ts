import { AbstractDecimal } from '../AbstractDecimal';
import { DecimalSPI } from '../DecimalSPI';

import { convertString } from './convertString';

export function convertNumber<C, D extends AbstractDecimal<C>>(spi: DecimalSPI<C, D>, n: number): D {
	if(typeof n !== 'number') {
		throw new Error('Can only be used with a number, received object with type ' + typeof n);
	}

	// TODO: Deconstruct number into coefficient and exponent and use that input?

	return convertString(spi, n.toString());
}
