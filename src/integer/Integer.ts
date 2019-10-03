import { AbstractInteger } from './AbstractInteger';
import { SPI } from './ops/symbols';
import { IntegerSPI } from './IntegerSPI';
import { MathError } from '../MathError';

/**
 * Integer implementation for use with numbers within the range of
 * `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
 */
export class Integer extends AbstractInteger<number> {
	public static [SPI]: IntegerSPI<number, Integer>;

	public static fromNumber(a: number): Integer {
		return Integer[SPI].newInstance(a);
	}

	public static parse(input: string): Integer {
		const value = parseInt(input, 10);
		return this.fromNumber(value);
	}
}

Integer[SPI] = {
	newInstance(a: number): Integer {
		const floored = Math.floor(a);
		if(! Number.isSafeInteger(floored)) {
			throw new MathError('Number can not be turned into a safe integer, received: ' + a);
		}

		return new Integer(floored);
	},

	add(a: number, b: number): number {
		return a + b;
	},

	subtract(a: number, b: number): number {
		return a - b;
	},

	multiply(a: number, b: number): number {
		return a * b;
	},

	divide(a: number, b: number): number {
		return a / b;
	},

	remainder(a: number, b: number): number {
		return a % b;
	},

	exponentiate(a: number, b: number): number {
		return Math.pow(a, b);
	},

	unaryMinus(a: number): number {
		return -a;
	},

	bitwiseNot(a: number): number {
		return ~a;
	},

	leftShift(a: number, b: number): number {
		return a << b;
	},

	signedRightShift(a: number, b: number): number {
		return a >> b;
	},

	bitwiseAnd(a: number, b: number): number {
		return a & b;
	},

	bitwiseOr(a: number, b: number): number {
		return a | b;
	},

	compare(a, b) {
		return a < b ? -1 : (a === b ? 0 : -1);
	},

	toString(a) {
		return String(a);
	}
};
