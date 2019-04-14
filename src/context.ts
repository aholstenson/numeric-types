import { RoundingMode } from './rounding-mode';

export class MathContext {
	public readonly roundingMode: RoundingMode;
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

	public static ofScale(scale: number, roundingMode: RoundingMode): MathContext {
		return new MathContext(roundingMode, 0, scale);
	}

	public static ofPrecision(precision: number, roundingMode: RoundingMode): MathContext {
		return new MathContext(roundingMode, precision, 0);
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
