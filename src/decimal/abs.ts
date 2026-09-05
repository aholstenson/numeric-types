import { AbstractDecimal } from './AbstractDecimal.js';
import { SPI, EXPONENT, COEFFICIENT } from './ops/symbols.js';

/**
 * Get the absolute value of a decimal number. The scale of the number is kept,
 * so `-1.50` becomes `1.50`.
 *
 * @param a
 */
export function abs<D extends AbstractDecimal<any>>(a: D): D {
	const spi = a[SPI];

	return spi.create(spi.ops.absolute(a[COEFFICIENT]), a[EXPONENT]);
}
