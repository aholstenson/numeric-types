import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

import { convertNumber } from './convertNumber';
import { convertString } from './convertString';

export function convertAny<C, D extends BaseDecimal<C>>(
	spi: DecimalSPI<C, D>,
	input: number | string | D
): D {
	if(typeof input === 'number') {
		return convertNumber(spi, input);
	} else if(typeof input === 'string') {
		return convertString(spi, input);
	} else if(input instanceof BaseDecimal) {
		return input;
	} else {
		throw new Error('Can not convert to decimal, got data of type `' + typeof input + `'`);
	}
}
