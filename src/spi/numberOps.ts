import { MathError } from '../MathError.js';

import { deriveOps } from './deriveOps.js';
import type { IntegerOps, IntegerProvider } from './IntegerOps.js';
import { validateIntegerString } from './parseString.js';

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);

/**
 * Check that a value is a whole number that a `number` holds exactly, and
 * return it.
 *
 * A `number` silently drops digits above `Number.MAX_SAFE_INTEGER`, and the
 * dropped digits can turn into trailing zeroes that a later step removes. The
 * check therefore runs on every result that can grow, and not only where a
 * value enters the library.
 *
 * @param a
 */
export function checkSafe(a: number): number {
	if(! Number.isSafeInteger(a)) {
		throw new MathError('Value is not a safe integer, got ' + a);
	}

	return a;
}

/**
 * Get the `number` that holds the same value as the given `bigint`, throwing a
 * `MathError` if it is outside the safe range.
 *
 * @param a
 */
export function fromBigInt(a: bigint): number {
	if(a > MAX_SAFE || a < MIN_SAFE) {
		throw new MathError('Value is not a safe integer, got ' + a);
	}

	return Number(a);
}

const provider: IntegerProvider<number> = {
	fromNumber(a) {
		return checkSafe(a);
	},

	parse(input) {
		/*
		 * Parse via `bigint` so that a value outside the safe range is
		 * reported instead of silently losing its last digits.
		 */
		return fromBigInt(BigInt(validateIntegerString(input)));
	},

	toNumber(a) {
		return a;
	},

	toString(a) {
		// A safe integer never uses e-notation in its string form.
		return String(a);
	},

	isZero(a) {
		return a === 0;
	},

	isNegative(a) {
		return a < 0;
	},

	compare(a, b) {
		return a === b ? 0 : (a < b ? -1 : 1);
	},

	add(a, b) {
		return checkSafe(a + b);
	},

	subtract(a, b) {
		return checkSafe(a - b);
	},

	multiply(a, b) {
		return checkSafe(a * b);
	},

	divide(a, b) {
		/*
		 * Truncate towards zero, so that the quotient and the remainder from
		 * `%` describe the same division.
		 */
		return Math.trunc(a / b);
	},

	remainder(a, b) {
		return a % b;
	},

	exponentiate(a, b) {
		if(b < 0) {
			throw new MathError('Exponent can not be negative, got ' + b);
		}

		return checkSafe(Math.pow(a, b));
	},

	negate(a) {
		// A safe integer stays safe when its sign is flipped.
		return -a;
	},

	/*
	 * The bitwise operators of JavaScript truncate their operands to 32 bits.
	 * These operations cover the full range of the type, so they go through
	 * `bigint` and then check that the result still fits.
	 */
	bitwiseNot(a) {
		return fromBigInt(~BigInt(a));
	},

	bitwiseAnd(a, b) {
		return fromBigInt(BigInt(a) & BigInt(b));
	},

	bitwiseOr(a, b) {
		return fromBigInt(BigInt(a) | BigInt(b));
	},

	leftShift(a, amount) {
		return fromBigInt(BigInt(a) << BigInt(amount));
	},

	signedRightShift(a, amount) {
		return fromBigInt(BigInt(a) >> BigInt(amount));
	}
};

/**
 * Arithmetic on whole numbers that a `number` holds exactly, which is the
 * range between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.
 *
 * `Integer` uses this for its value, and `Decimal` for its coefficient.
 */
export const numberOps: IntegerOps<number> = deriveOps(provider);
