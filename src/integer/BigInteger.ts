import JSBI from 'jsbi';

import { AbstractInteger } from './AbstractInteger';
import { SPI } from './ops/symbols';
import { IntegerSPI } from './IntegerSPI';

/**
 * Integer implementation that supports large numbers.
 */
export class BigInteger extends AbstractInteger<JSBI> {
	public static [SPI]: IntegerSPI<JSBI, BigInteger>;

	public static fromNumber(a: number): BigInteger {
		return BigInteger[SPI].newInstance(JSBI.BigInt(a));
	}

	public static parse(input: string): BigInteger {
		return BigInteger[SPI].newInstance(JSBI.BigInt(input));
	}
}

BigInteger[SPI] = {
	newInstance(a): BigInteger {
		const data = JSBI.BigInt(a);
		return new BigInteger(data);
	},

	add(a, b) {
		return JSBI.add(a, b);
	},

	subtract(a, b) {
		return JSBI.subtract(a, b);
	},

	multiply(a, b) {
		return JSBI.multiply(a, b);
	},

	divide(a, b) {
		return JSBI.divide(a, b);
	},

	remainder(a, b) {
		return JSBI.remainder(a, b);
	},

	exponentiate(a, b) {
		return JSBI.exponentiate(a, b);
	},

	unaryMinus(a) {
		return JSBI.unaryMinus(a);
	},

	bitwiseNot(a) {
		return JSBI.bitwiseNot(a);
	},

	leftShift(a, b) {
		return JSBI.leftShift(a, JSBI.BigInt(b));
	},

	signedRightShift(a, b) {
		return JSBI.signedRightShift(a, JSBI.BigInt(b));
	},

	bitwiseAnd(a, b) {
		return JSBI.bitwiseAnd(a, b);
	},

	bitwiseOr(a, b) {
		return JSBI.bitwiseOr(a, b);
	},

	compare(a, b) {
		if(JSBI.lessThan(a, b)) {
			return -1;
		} else if(JSBI.greaterThan(a, b)) {
			return 1;
		}

		return 0;
	},

	toString(a) {
		return String(a);
	}
};
