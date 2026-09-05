import { MathError } from '../MathError.js';

import { deriveOps } from './deriveOps.js';
import type { IntegerOps, IntegerProvider } from './IntegerOps.js';
import { validateIntegerString } from './parseString.js';

const provider: IntegerProvider<bigint> = {
	fromNumber(a) {
		if(! Number.isInteger(a)) {
			throw new MathError('Number is not a whole number, received: ' + a);
		}

		return BigInt(a);
	},

	parse(input) {
		return BigInt(validateIntegerString(input));
	},

	toNumber(a) {
		return Number(a);
	},

	toString(a) {
		return String(a);
	},

	isZero(a) {
		return a === 0n;
	},

	isNegative(a) {
		return a < 0n;
	},

	compare(a, b) {
		return a === b ? 0 : (a < b ? -1 : 1);
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
		// Division between two `bigint` values truncates towards zero.
		return a / b;
	},

	remainder(a, b) {
		return a % b;
	},

	exponentiate(a, b) {
		if(b < 0n) {
			throw new MathError('Exponent can not be negative, got ' + b);
		}

		return a ** b;
	},

	negate(a) {
		return -a;
	},

	bitwiseNot(a) {
		return ~a;
	},

	bitwiseAnd(a, b) {
		return a & b;
	},

	bitwiseOr(a, b) {
		return a | b;
	},

	leftShift(a, amount) {
		return a << BigInt(amount);
	},

	signedRightShift(a, amount) {
		return a >> BigInt(amount);
	}
};

/**
 * Arithmetic on whole numbers held as the built-in `bigint` type, where the
 * range is limited only by the memory that is available.
 *
 * `BigInteger` uses this for its value, and `BigDecimal` for its coefficient.
 */
export const bigIntOps: IntegerOps<bigint> = deriveOps(provider);
