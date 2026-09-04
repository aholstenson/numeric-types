import { AbstractInteger } from './AbstractInteger.js';
import { SPI } from './ops/symbols.js';
import type { IntegerSPI } from './IntegerSPI.js';
import { MathError } from '../MathError.js';

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

	/*
	 * The bitwise operators of JavaScript truncate their operands to 32 bits.
	 * These operations cover the full range of the type, so they go through
	 * `bigint` instead. `newInstance` rejects a result that no longer fits.
	 */
	bitwiseNot(a: number): number {
		return Number(~BigInt(a));
	},

	leftShift(a: number, b: number): number {
		return Number(BigInt(a) << BigInt(b));
	},

	signedRightShift(a: number, b: number): number {
		return Number(BigInt(a) >> BigInt(b));
	},

	bitwiseAnd(a: number, b: number): number {
		return Number(BigInt(a) & BigInt(b));
	},

	bitwiseOr(a: number, b: number): number {
		return Number(BigInt(a) | BigInt(b));
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
