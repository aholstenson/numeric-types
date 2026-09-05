import { AbstractInteger } from './AbstractInteger.js';
import { SPI, VALUE } from './ops/symbols.js';
import type { BigInteger } from './BigInteger.js';
import type { IntegerSPI } from './IntegerSPI.js';
import { MathError } from '../MathError.js';
import { validateIntegerString } from './ops/parseString.js';

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);

/**
 * Integer implementation for use with numbers within the range of
 * `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
 */
export class Integer extends AbstractInteger<number> {
	public static [SPI]: IntegerSPI<number, Integer>;

	/**
	 * Create an integer from a number. The number must already be a whole
	 * number within the safe range, as rounding it here would hide a mistake
	 * in the calling code.
	 */
	public static fromNumber(a: number): Integer {
		return Integer[SPI].newInstance(a);
	}

	/**
	 * Create an integer from a string holding its base-10 representation.
	 */
	public static parse(input: string): Integer {
		/*
		 * Parse via `bigint` so that a value outside the safe range is
		 * reported instead of silently losing its last digits.
		 */
		const value = BigInt(validateIntegerString(input));
		if(value > MAX_SAFE || value < MIN_SAFE) {
			throw new MathError('Number can not be turned into a safe integer, received: ' + input);
		}

		return Integer[SPI].newInstance(Number(value));
	}

	/**
	 * Create an integer from a `BigInteger`.
	 *
	 * A `BigInteger` covers a larger range, so a value outside the safe range
	 * of `number` throws a `MathError` instead of losing its last digits.
	 */
	public static fromBigInteger(a: BigInteger): Integer {
		/*
		 * Both integer types are an `AbstractInteger`, so the check looks at
		 * the value. Only `BigInteger` keeps that as a `bigint`.
		 */
		if(! (a instanceof AbstractInteger) || typeof a[VALUE] !== 'bigint') {
			throw new MathError('Expected a BigInteger');
		}

		const value = a[VALUE];
		if(value > MAX_SAFE || value < MIN_SAFE) {
			throw new MathError('Number can not be turned into a safe integer, received: ' + value);
		}

		return Integer[SPI].newInstance(Number(value));
	}
}

Integer[SPI] = {
	newInstance(a: number): Integer {
		if(! Number.isSafeInteger(a)) {
			throw new MathError('Number can not be turned into a safe integer, received: ' + a);
		}

		return new Integer(a);
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
		// Truncate towards zero, in the same way as `bigint` division does.
		return Math.trunc(a / b);
	},

	remainder(a: number, b: number): number {
		return a % b;
	},

	isZero(a: number): boolean {
		return a === 0;
	},

	isNegative(a: number): boolean {
		return a < 0;
	},

	exponentiate(a: number, b: number): number {
		return Math.pow(a, b);
	},

	unaryMinus(a: number): number {
		return -a;
	},

	absolute(a: number): number {
		return Math.abs(a);
	},

	wrap(a: number): number {
		return a;
	},

	toNumber(a: number): number {
		return a;
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
