import { MathError } from '../../MathError.js';

import { AbstractDecimal } from '../AbstractDecimal.js';
import type { DecimalSPI } from '../DecimalSPI.js';

import { RoundingMode } from '../../RoundingMode.js';

/**
 * Round the result of a division that truncates towards zero.
 *
 * The caller divides a dividend by a divisor and keeps both the quotient and
 * the remainder. The division must truncate towards zero, so that:
 *
 * ```
 * quotient * divisor + remainder === dividend
 * ```
 *
 * The exact value is `quotient + remainder / divisor`. Its two neighbors are
 * the quotient itself, which lies towards zero, and the quotient moved one
 * step away from zero. This function selects one of them.
 *
 * @param spi
 * @param mode
 *   the rounding mode to apply
 * @param quotient
 *   the truncated quotient
 * @param remainder
 *   the remainder of the same division
 * @param divisor
 *   the divisor that was used, needed to measure how large the remainder is
 */
export function round<C, D extends AbstractDecimal<C>>(
	spi: DecimalSPI<C, D>,
	mode: RoundingMode,
	quotient: C,
	remainder: C,
	divisor: C
): C {
	if(spi.isZero(remainder)) {
		/*
		 * The value is exact, so both neighbors are the same and no rounding
		 * is needed.
		 */
		return quotient;
	}

	if(mode === RoundingMode.Unnecessary) {
		throw new MathError('Rounding necessary');
	}

	/*
	 * The fraction `remainder / divisor` carries the sign of the exact value.
	 * The quotient can not be used for this, as it is zero for every value
	 * between -1 and 1.
	 */
	const isNegative = spi.isNegative(remainder) !== spi.isNegative(divisor);

	let awayFromZero: boolean;
	switch(mode) {
		case RoundingMode.Down:
			// Towards zero, so keep the quotient.
			awayFromZero = false;
			break;
		case RoundingMode.Up:
			// Away from zero.
			awayFromZero = true;
			break;
		case RoundingMode.Floor:
			// Towards negative infinity.
			awayFromZero = isNegative;
			break;
		case RoundingMode.Ceiling:
			// Towards positive infinity.
			awayFromZero = ! isNegative;
			break;
		case RoundingMode.HalfDown:
		case RoundingMode.HalfEven:
		case RoundingMode.HalfUp: {
			/*
			 * Compare twice the remainder against the divisor to find the
			 * nearest neighbor. Doubling avoids a division, and it stays
			 * exact for both coefficient types.
			 */
			const doubled = spi.multiply(spi.absolute(remainder), spi.wrap(2));
			const distance = spi.compare(doubled, spi.absolute(divisor));

			if(distance < 0) {
				// The neighbor towards zero is nearer.
				awayFromZero = false;
			} else if(distance > 0) {
				// The neighbor away from zero is nearer.
				awayFromZero = true;
			} else if(mode === RoundingMode.HalfDown) {
				// Both neighbors are equidistant, so round towards zero.
				awayFromZero = false;
			} else if(mode === RoundingMode.HalfUp) {
				// Both neighbors are equidistant, so round away from zero.
				awayFromZero = true;
			} else {
				// Both neighbors are equidistant, so keep the even one.
				awayFromZero = ! spi.isMultipleOf(quotient, spi.wrap(2));
			}
			break;
		}
		default:
			throw new MathError('Unknown rounding mode: ' + mode);
	}

	if(! awayFromZero) {
		return quotient;
	}

	return isNegative
		? spi.subtract(quotient, spi.ONE)
		: spi.add(quotient, spi.ONE);
}
