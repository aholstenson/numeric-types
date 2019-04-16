import { AbstractDecimal } from '../abstract-decimal';
import { DecimalSPI } from '../decimal-spi';

import { convertNumber } from './convertNumber';
import { convertString } from './convertString';

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
		throw new Error('Can not convert to decimal, got data of type `' + typeof input + `'`);
	}
}
