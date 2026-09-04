import { AbstractInteger } from './AbstractInteger.js';
import { SPI } from './ops/symbols.js';
import type { IntegerSPI } from './IntegerSPI.js';

/**
 * Integer implementation that supports large numbers. Values are stored as
 * the built-in `bigint` type, so the range is limited only by the memory that
 * is available.
 */
export class BigInteger extends AbstractInteger<bigint> {
	public static [SPI]: IntegerSPI<bigint, BigInteger>;

	public static fromNumber(a: number): BigInteger {
		return BigInteger[SPI].newInstance(BigInt(a));
	}

	public static parse(input: string): BigInteger {
		return BigInteger[SPI].newInstance(BigInt(input));
	}
}

BigInteger[SPI] = {
	newInstance(a): BigInteger {
		return new BigInteger(a);
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
		return a / b;
	},

	remainder(a, b) {
		return a % b;
	},

	exponentiate(a, b) {
		return a ** b;
	},

	unaryMinus(a) {
		return -a;
	},

	bitwiseNot(a) {
		return ~a;
	},

	leftShift(a, b) {
		return a << BigInt(b);
	},

	signedRightShift(a, b) {
		return a >> BigInt(b);
	},

	bitwiseAnd(a, b) {
		return a & b;
	},

	bitwiseOr(a, b) {
		return a | b;
	},

	compare(a, b) {
		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		}

		return 0;
	},

	toString(a) {
		return String(a);
	}
};
