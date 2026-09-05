import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

/**
 * Get a decimal number with its sign flipped. The scale of the number is kept,
 * so `1.50` becomes `-1.50`.
 *
 * @param a
 */
export function negate<D extends AbstractDecimal<any>>(a: D): D {
	const spi = a[SPI];

	return spi.newInstance(spi.negate(a[COEFFICIENT]), a[EXPONENT]);
}
