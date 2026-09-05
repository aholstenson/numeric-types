import { SPI, VALUE } from './ops/symbols.js';
import type { IntegerSPI } from './IntegerSPI.js';

/**
 * Base class for integer values.
 */
export abstract class AbstractInteger<V> {
	public readonly [VALUE]: V;

	constructor(value: V) {
		this[VALUE] = value;
	}

	public toString(): string {
		return this[SPI].toString(this[VALUE]);
	}

	/**
	 * Get this value as a `number`. The result is the nearest `number` to this
	 * value, so a value outside the safe range of `number` loses digits.
	 */
	public toNumber(): number {
		return this[SPI].toNumber(this[VALUE]);
	}

	/**
	 * Get the value that `JSON.stringify` writes for this integer. A large
	 * integer does not survive a JSON number, so the value is written as a
	 * string and keeps all of its digits.
	 */
	public toJSON(): string {
		return this.toString();
	}

	/**
	 * Convert this integer when JavaScript needs a primitive. A hint of
	 * `number` gives the result of `toNumber`, and every other hint gives the
	 * string. `+` therefore joins strings instead of doing math that would
	 * lose digits.
	 */
	public [Symbol.toPrimitive](hint: string): string | number {
		return hint === 'number' ? this.toNumber() : this.toString();
	}

	public get [SPI](): IntegerSPI<V, this> {
		// @ts-ignore
		return this.constructor[SPI];
	}
}
