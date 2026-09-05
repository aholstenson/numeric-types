import { RoundingMode } from './RoundingMode.js';

/**
 * Number of digits kept after the decimal point by a division that is given
 * neither a scale nor a precision. Trailing zeroes are removed afterwards, so
 * this is an upper limit and not the scale of the result.
 */
export const DEFAULT_DIVISION_SCALE = 5;

export class MathContext {
	public readonly roundingMode: RoundingMode;

	/**
	 * Precision indicates the number of significant digits to keep. A context
	 * that sets a scale ignores the precision.
	 */
	public readonly precision?: number;

	/**
	 * Scale indicates the number of digits after the decimal point.
	 */
	public readonly scale?: number;

	constructor(
		roundingMode: RoundingMode,
		precision?: number,
		scale?: number
	) {
		this.roundingMode = roundingMode;
		this.precision = precision;
		this.scale = scale;
	}

	/**
	 * Create a context that keeps the given number of digits after the
	 * decimal point.
	 */
	public static ofScale(scale: number, roundingMode: RoundingMode): MathContext {
		return new MathContext(roundingMode, undefined, scale);
	}

	/**
	 * Create a context that keeps the given number of significant digits.
	 */
	public static ofPrecision(precision: number, roundingMode: RoundingMode): MathContext {
		return new MathContext(roundingMode, precision, undefined);
	}
}

/**
 * Get if a given context has a scale or precision set.
 *
 * @param context
 */
export function hasScaleOrPrecision(context: MathContext) {
	return typeof context.scale !== 'undefined'
		|| typeof context.precision !== 'undefined';
}
