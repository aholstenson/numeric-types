import { BaseDecimal } from '../decimal-base';
import { DecimalSPI } from '../decimal-spi';

import { RoundingMode } from '../../rounding-mode';

/**
 * Perform rounding on a coefficient and remainder.
 */
export function round<C, D extends BaseDecimal<C>>(
	spi: DecimalSPI<C, D>,
	mode: RoundingMode,
	coefficient: C,
	remainder: C
): C {
	if(spi.isZero(remainder)) {
		/*
		 * No rounding needs to be performed if the remainder is zero, so
		 * just return the coefficient unmodified.
		 */
		return coefficient;
	}

	const isNegative = spi.isNegative(coefficient);

	let increment;
	switch(mode) {
		case RoundingMode.Unnecessary:
			throw new Error('Rounding necessary');
		case RoundingMode.Down:
			/*
			 * Round towards zero, so negative values need to be incremented.
			 */
			increment = isNegative;
			break;
		case RoundingMode.Up:
			/**
			 * Round away from zero, so positive values need to be incremented.
			 */
			increment = ! isNegative;
			break;
		case RoundingMode.Floor:
			/*
			 * Round towards negative infinity. Never increment.
			 */
			increment = false;
			break;
		case RoundingMode.Ceiling:
			/*
			 * Round towards positive infinity. Always increment.
			 */
			increment = true;
			break;
		case RoundingMode.HalfDown:
		case RoundingMode.HalfEven:
		case RoundingMode.HalfUp:
			const r = spi.firstDigit(remainder);
			if(r < 5) {
				// Round towards zero
				increment = isNegative;
			} else if(r > 5) {
				// Round away from zero
				increment = ! isNegative;
			} else {
				/*
				 * Both neighbors are equidistant. Decide on what to do.
				 */
				if(mode === RoundingMode.HalfDown) {
					/*
					 * Round towards zero.
					 */
					increment = isNegative;
				} else if(mode === RoundingMode.HalfUp) {
					/*
					 * Round away from zero.
					 */
					increment = ! isNegative;
				} else {
					/*
					 * Half-even, round towards the even part.
					 */
					const isEven = spi.isMultipleOf(coefficient, spi.wrap(2));
					increment = ! isEven;
				}
			}
	}

	if(increment) {
		return spi.add(coefficient, spi.ONE);
	} else {
		return coefficient;
	}
}
