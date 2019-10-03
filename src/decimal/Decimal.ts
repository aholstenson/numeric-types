import { MathError } from '../MathError';

import { AbstractDecimal } from './AbstractDecimal';
import { DecimalSPI } from './DecimalSPI';
import { SPI } from './ops/symbols';

import { convertNumber } from './ops/convertNumber';
import { convertString } from './ops/convertString';

/**
 * Decimal implementation with limited precision.
 */
export class Decimal extends AbstractDecimal<number> {
	public static [SPI]: DecimalSPI<number, Decimal>;

	constructor(coefficent: number, exponent: number) {
		checkSafe(coefficent);

		super(coefficent, exponent);
	}

	public static fromNumber(a: number): Decimal {
		return convertNumber(Decimal[SPI], a);
	}

	public static parse(input: string): Decimal {
		return convertString(Decimal[SPI], input);
	}
}

function checkSafe(a: number) {
	if(! Number.isSafeInteger(a)) {
		throw new MathError('Coefficient is not a safe integer, got ' + a);
	}
}

Decimal[SPI] = {
	DECIMAL_ZERO: new Decimal(0, 0),

	DECIMAL_ONE: new Decimal(1, 0),

	ONE: 1,

	TEN: 10,

	DEFAULT_EXPONENT: -5,

	newInstance(coefficent, exponent) {
		return new Decimal(coefficent, exponent);
	},

	isZero(a) {
		return a === 0;
	},

	isMultipleOf(a, b) {
		return a % b === 0;
	},

	isNegative(a) {
		return a < 0;
	},

	compare(a, b) {
		return a === b ? 0 : (a < b ? -1 : 1);
	},

	parseInt(input) {
		return parseInt(input, 10);
	},

	firstDigit(a) {
		a = Math.abs(a);
		const digits = Math.max(Math.floor(Math.log10(a)), 0) + 1;
		return Math.floor(a / Math.pow(10, digits - 1));
	},

	toString(a) {
		return a.toString();
	},

	wrap(a) {
		return a;
	},

	add(a, b) {
		return a + b;
	},

	subtract(a, b) {
		return a - b;
	},

	multiply(a, b) {
		return a * b;
	},

	divide(a, b) {
		return Math.floor(a / b);
	},

	remainder(a, b) {
		return a % b;
	},

	exponentiate(a, b) {
		return Math.pow(a, b);
	},

	absolute(a) {
		return Math.abs(a);
	}
} as DecimalSPI<number, Decimal>;
