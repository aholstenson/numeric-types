import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols';

import { DecimalSPI } from './decimal-spi';
import { MathContext } from '../context';

import { add } from './add';
import { subtract } from './subtract';
import { multiply } from './multiply';
import { compare } from './compare';
import { toString } from './toString';
import { divide } from './divide';

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

	public add(b: this): this {
		return add(this, b);
	}

	public subtract(b: this): this {
		return subtract(this, b);
	}

	public multiply(b: this): this {
		return multiply(this, b);
	}

	public divide(b: this, ctx: MathContext): this {
		return divide(this, b, ctx);
	}

	public compare(b: this): number {
		return compare(this, b);
	}

	public toString(): string {
		return toString(this);
	}

	public get [SPI](): DecimalSPI<C, this> {
		// @ts-ignore
		return this.constructor[SPI];
	}
}


