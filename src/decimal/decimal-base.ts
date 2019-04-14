import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols';

import { DecimalSPI } from './decimal-spi';

import { toString } from './toString';

/**
 * Base class for decimal values. Stores numbers in two parts, a coefficent and
 * a exponent in base 10.
 *
 * The value of a decimal is calculated with:
 *
 * ```
 * coefficient * 10 ^ exponent
 * ```
 *
 * BaseDecimal is designed so that the exponent is always a `number` and
 * `coefficient` is a dense value that subclasses define.
 */
export class BaseDecimal<C> {
	public readonly [EXPONENT]: number;
	public readonly [COEFFICIENT]: C;

	constructor(coefficient: C, exponent: number) {
		this[EXPONENT] = exponent;
		this[COEFFICIENT] = coefficient;
	}

	public toString(): string {
		return toString(this);
	}

	public get [SPI](): DecimalSPI<C, this> {
		// @ts-ignore
		return this.constructor[SPI];
	}
}
