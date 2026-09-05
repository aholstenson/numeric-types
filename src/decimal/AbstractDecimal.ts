import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

import type { DecimalSPI } from './DecimalSPI.js';

import { toString } from './toString.js';
import { toNumber } from './toNumber.js';

/**
 * Base class for decimal values. Stores numbers in two parts, a coefficient
 * and an exponent in base 10.
 *
 * The value of a decimal is calculated with:
 *
 * ```
 * coefficient * 10 ^ exponent
 * ```
 *
 * The exponent is always a `number`. The coefficient is a whole number held in
 * a dense value that the subclass decides, together with the arithmetic that
 * calculates with it.
 */
export abstract class AbstractDecimal<C> {
	public readonly [EXPONENT]: number;
	public readonly [COEFFICIENT]: C;

	constructor(coefficient: C, exponent: number) {
		this[EXPONENT] = exponent;
		this[COEFFICIENT] = coefficient;
	}

	/**
	 * The arithmetic and the factory of this decimal type. Every instance of a
	 * type returns the same object, so two values can be used together when
	 * this is the same for both of them.
	 */
	public abstract get [SPI](): DecimalSPI<C, this>;

	public toString(): string {
		return toString(this);
	}

	/**
	 * Get this value as a `number`. The result is the nearest `number` to this
	 * value, so digits that a `number` can not hold are lost and a value that
	 * is too large becomes `Infinity`.
	 */
	public toNumber(): number {
		return toNumber(this);
	}

	/**
	 * Get the value that `JSON.stringify` writes for this decimal. JSON has no
	 * exact decimal type, so the value is written as a string and keeps all of
	 * its digits.
	 */
	public toJSON(): string {
		return this.toString();
	}

	/**
	 * Convert this decimal when JavaScript needs a primitive. A hint of
	 * `number` gives the result of `toNumber`, and every other hint gives the
	 * string. `+` therefore joins strings instead of doing math that would
	 * lose digits.
	 */
	public [Symbol.toPrimitive](hint: string): string | number {
		return hint === 'number' ? this.toNumber() : this.toString();
	}
}
