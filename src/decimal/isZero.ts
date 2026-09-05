import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI, COEFFICIENT } from './ops/symbols.js';

/**
 * Get if a decimal number is zero. The scale does not matter, so `0`, `0.0`
 * and `0e10` are all zero.
 *
 * @param a
 */
export function isZero<D extends AbstractDecimal<any>>(a: D): boolean {
	return a[SPI].isZero(a[COEFFICIENT]);
}
