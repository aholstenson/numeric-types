import { EXPONENT, COEFFICIENT } from './symbols';
import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

/**
 * Operation that subtract the decimal value b from a.
 *
 * @param {BaseDecimal} a
 * @param {BaseDecimal} b
 */
export function subtractOp<C, D extends BaseDecimal<C>>(math: DecimalSPI<C, D>, a: D, b: D): D {
	const aExp = a[EXPONENT];
	const bExp = b[EXPONENT];

	const diff = aExp - bExp;
	if(diff === 0) {
		// The same exponent results a simple add between the coefficients
		const r = math.subtract(a[COEFFICIENT], b[COEFFICIENT]);
		return math.newInstance(r, aExp);
	} else if(diff > 0) {
		// Need to align the coefficients and a's exponent is bigger
		const alignedA = math.multiply(a[COEFFICIENT], math.exponentiate(math.TEN, math.wrap(diff)));
		const r = math.subtract(alignedA, b[COEFFICIENT]);
		return math.newInstance(r, bExp);
	} else {
		// Need to align the coefficients and b's exponent is bigger
		const alignedB = math.multiply(b[COEFFICIENT], math.exponentiate(math.TEN, math.wrap(-diff)));
		const r = math.subtract(a[COEFFICIENT], alignedB);
		return math.newInstance(r, aExp);
	}
}
