import { MathContext } from '../../MathContext.js';
import { MathError } from '../../MathError.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { EXPONENT, COEFFICIENT } from './symbols.js';
import { divideOp } from './divideOp.js';
import { rescaleCoefficientAndExponent } from './rescalingOp.js';

/**
 * Operation that raises a decimal to a whole power.
 */
export function powOp<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	a: D,
	exponent: number,
	context?: MathContext
): D {
	if(! Number.isSafeInteger(exponent)) {
		throw new MathError('Exponent must be a safe whole number, got ' + exponent);
	}

	const ops = spi.ops;

	if(exponent === 0) {
		// Every value raised to zero is one, including zero itself.
		return rescaleCoefficientAndExponent(spi, ops.ONE, 0, context);
	}

	if(exponent < 0) {
		if(typeof context === 'undefined') {
			/*
			 * A negative power is a division, and a division rarely has an
			 * exact result. The caller has to say how many digits to keep.
			 */
			throw new MathError('A context is required when the exponent is negative, got ' + exponent);
		}

		const positivePower = powOp(spi, a, - exponent);
		return divideOp(spi, spi.ONE, positivePower, context);
	}

	/*
	 * `(c * 10^e)^n` is `c^n * 10^(e*n)`, so both parts are raised on their
	 * own and the result stays exact.
	 */
	const coefficient = ops.exponentiate(a[COEFFICIENT], ops.fromNumber(exponent));

	return rescaleCoefficientAndExponent(spi, coefficient, a[EXPONENT] * exponent, context);
}
