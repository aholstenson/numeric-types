import { SPI, VALUE } from './ops/symbols';
import { IntegerSPI } from './IntegerSPI';

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

	public get [SPI](): IntegerSPI<V, this> {
		// @ts-ignore
		return this.constructor[SPI];
	}
}
