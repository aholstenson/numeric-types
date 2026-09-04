import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { convertNumber } from './convertNumber.js';
import { convertString } from './convertString.js';

export function convertAny<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	input: number | string | D
): D {
	if(typeof input === 'number') {
		return convertNumber(spi, input);
	} else if(typeof input === 'string') {
		return convertString(spi, input);
	} else if(input instanceof AbstractDecimal) {
		return input;
	} else {
		throw new Error('Can not convert to decimal, got data of type `' + typeof input + '`');
	}
}
