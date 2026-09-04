import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { AbstractDecimal } from '../../src/decimal/AbstractDecimal.js';
import { MathContext } from '../../src/MathContext.js';
import { RoundingMode } from '../../src/RoundingMode.js';
import { COEFFICIENT, SPI } from '../../src/decimal/ops/symbols.js';

import { add } from '../../src/decimal/add.js';
import { subtract } from '../../src/decimal/subtract.js';
import { multiply } from '../../src/decimal/multiply.js';
import { divide } from '../../src/decimal/divide.js';
import { scale } from '../../src/decimal/scale.js';

/*
 * These tests compare the library against a reference built on exact rational
 * arithmetic with `bigint`.
 *
 * The reference picks between the two neighbors by measuring the distance to
 * each of them. The library instead truncates and inspects the remainder. The
 * two routes are independent, so a mistake in one of them does not hide a
 * mistake in the other.
 *
 * The inputs come from a small generator with a fixed seed, so a failure can
 * always be repeated.
 */

const MODES = [
	RoundingMode.Down,
	RoundingMode.Up,
	RoundingMode.Floor,
	RoundingMode.Ceiling,
	RoundingMode.HalfDown,
	RoundingMode.HalfUp,
	RoundingMode.HalfEven
];

/**
 * Deterministic generator, so that every run uses the same inputs.
 */
function createRandom(seed: number): () => number {
	let state = seed;
	return function() {
		state = (state * 1103515245 + 12345) % 2147483648;
		return state / 2147483648;
	};
}

/**
 * An exact value, held as `coefficient * 10^exponent`.
 */
interface Exact {
	coefficient: bigint;
	exponent: number;
}

const TEN = 10n;

function pow10(n: number): bigint {
	return TEN ** BigInt(n);
}

/**
 * Parse a decimal string into an exact value. This is deliberately separate
 * from the parsing that the library does.
 */
function parseExact(input: string): Exact {
	const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(input);
	if(! match) {
		throw new Error('Test input is not a plain decimal: ' + input);
	}

	const fraction = match[3] ?? '';
	const digits = BigInt(match[2] + fraction);

	return {
		coefficient: match[1] === '-' ? - digits : digits,
		exponent: - fraction.length
	};
}

function toExactString(value: Exact): string {
	return value.coefficient.toString() + 'e' + value.exponent;
}

/**
 * Floor division for `bigint`, which truncates towards zero on its own.
 */
function floorDivide(a: bigint, b: bigint): bigint {
	const quotient = a / b;
	if(a % b !== 0n && (a < 0n) !== (b < 0n)) {
		return quotient - 1n;
	}

	return quotient;
}

/**
 * Round the rational `numerator / denominator` to a whole number.
 *
 * The two candidates are the values below and above the exact one. The
 * distance to each of them decides which one wins.
 */
function roundRational(numerator: bigint, denominator: bigint, mode: RoundingMode): bigint {
	// Keep the denominator positive so that comparisons stay simple.
	if(denominator < 0n) {
		numerator = - numerator;
		denominator = - denominator;
	}

	const below = floorDivide(numerator, denominator);
	const distanceBelow = numerator - below * denominator;

	if(distanceBelow === 0n) {
		// The value is already a whole number.
		return below;
	}

	if(mode === RoundingMode.Unnecessary) {
		throw new Error('Rounding necessary');
	}

	const above = below + 1n;
	const distanceAbove = above * denominator - numerator;

	const isNegative = numerator < 0n;
	const towardsZero = isNegative ? above : below;
	const awayFromZero = isNegative ? below : above;

	switch(mode) {
		case RoundingMode.Down:
			return towardsZero;
		case RoundingMode.Up:
			return awayFromZero;
		case RoundingMode.Floor:
			return below;
		case RoundingMode.Ceiling:
			return above;
		default:
			break;
	}

	if(distanceBelow < distanceAbove) {
		return below;
	} else if(distanceAbove < distanceBelow) {
		return above;
	}

	switch(mode) {
		case RoundingMode.HalfDown:
			return towardsZero;
		case RoundingMode.HalfUp:
			return awayFromZero;
		default:
			// Half-even keeps the candidate that is even.
			return below % 2n === 0n ? below : above;
	}
}

/**
 * Reference for `scale`: round a value to the given number of digits after
 * the decimal point.
 */
function referenceScale(value: Exact, scaleDigits: number, mode: RoundingMode): Exact {
	const target = - scaleDigits;
	const shift = value.exponent - target;

	const numerator = shift >= 0 ? value.coefficient * pow10(shift) : value.coefficient;
	const denominator = shift >= 0 ? 1n : pow10(- shift);

	return {
		coefficient: roundRational(numerator, denominator, mode),
		exponent: target
	};
}

/**
 * Reference for `divide`: divide two values and round to the given number of
 * digits after the decimal point.
 */
function referenceDivide(a: Exact, b: Exact, scaleDigits: number, mode: RoundingMode): Exact {
	const target = - scaleDigits;
	const shift = a.exponent - b.exponent - target;

	const numerator = shift >= 0 ? a.coefficient * pow10(shift) : a.coefficient;
	const denominator = shift >= 0 ? b.coefficient : b.coefficient * pow10(- shift);

	return {
		coefficient: roundRational(numerator, denominator, mode),
		exponent: target
	};
}

function referenceAdd(a: Exact, b: Exact): Exact {
	const exponent = Math.min(a.exponent, b.exponent);
	return {
		coefficient: a.coefficient * pow10(a.exponent - exponent)
			+ b.coefficient * pow10(b.exponent - exponent),
		exponent: exponent
	};
}

function referenceSubtract(a: Exact, b: Exact): Exact {
	return referenceAdd(a, { coefficient: - b.coefficient, exponent: b.exponent });
}

function referenceMultiply(a: Exact, b: Exact): Exact {
	return {
		coefficient: a.coefficient * b.coefficient,
		exponent: a.exponent + b.exponent
	};
}

/**
 * Compare two exact values, ignoring how they are written. `1.0` and `1` are
 * the same value.
 */
function isSameValue(a: Exact, b: Exact): boolean {
	const exponent = Math.min(a.exponent, b.exponent);
	return a.coefficient * pow10(a.exponent - exponent)
		=== b.coefficient * pow10(b.exponent - exponent);
}

/**
 * Count the significant digits that a decimal keeps. The coefficient holds
 * them, so the trailing zeroes of a value such as `940` do not count.
 */
function significantDigits<C>(value: AbstractDecimal<C>): number {
	return value[SPI].digits(value[COEFFICIENT]);
}

/**
 * Count the digits after the decimal point in a string.
 */
function digitsAfterPoint(value: string): number {
	const index = value.indexOf('.');
	return index === -1 ? 0 : value.length - index - 1;
}

/**
 * Build a decimal string from a generator.
 */
function nextValue(random: () => number, maxDigits: number, maxFraction: number): string {
	const digits = 1 + Math.floor(random() * maxDigits);
	let value = '';
	for(let i = 0; i < digits; i++) {
		value += Math.floor(random() * 10).toString();
	}

	const fraction = Math.floor(random() * (maxFraction + 1));
	if(fraction > 0) {
		value = value.padStart(fraction + 1, '0');
		value = value.substring(0, value.length - fraction) + '.' + value.substring(value.length - fraction);
	}

	// Strip leading zeroes that a padded value can introduce.
	value = value.replace(/^0+(\d)/, '$1');

	return random() < 0.5 ? '-' + value : value;
}

describe('Decimal', function() {
	describe('Differential', function() {
		it('scale matches exact rational rounding', function() {
			const random = createRandom(20260904);

			for(let i = 0; i < 2000; i++) {
				const input = nextValue(random, 6, 4);
				const digits = Math.floor(random() * 5);
				const mode = MODES[Math.floor(random() * MODES.length)];
				const context = MathContext.ofScale(digits, mode);

				const expected = referenceScale(parseExact(input), digits, mode);

				for(const actual of [
					scale(Decimal.parse(input), context).toString(),
					scale(BigDecimal.parse(input), context).toString()
				]) {
					const message = 'scale(' + input + ', ' + digits + ', ' + mode + ')'
						+ ' gave ' + actual + ', expected ' + toExactString(expected);

					expect(digitsAfterPoint(actual), message).toEqual(digits);
					expect(isSameValue(parseExact(actual), expected), message).toEqual(true);
				}
			}
		});

		it('divide matches exact rational rounding', function() {
			const random = createRandom(180177);

			for(let i = 0; i < 2000; i++) {
				const first = nextValue(random, 4, 3);
				const second = nextValue(random, 4, 3);
				const digits = Math.floor(random() * 5);
				const mode = MODES[Math.floor(random() * MODES.length)];
				const context = MathContext.ofScale(digits, mode);

				const a = parseExact(first);
				const b = parseExact(second);
				if(b.coefficient === 0n) {
					continue;
				}

				const expected = referenceDivide(a, b, digits, mode);

				for(const actual of [
					divide(Decimal.parse(first), Decimal.parse(second), context).toString(),
					divide(BigDecimal.parse(first), BigDecimal.parse(second), context).toString()
				]) {
					const message = 'divide(' + first + ', ' + second + ', ' + digits + ', ' + mode + ')'
						+ ' gave ' + actual + ', expected ' + toExactString(expected);

					expect(digitsAfterPoint(actual), message).toEqual(digits);
					expect(isSameValue(parseExact(actual), expected), message).toEqual(true);
				}
			}
		});

		it('add, subtract and multiply stay exact', function() {
			const random = createRandom(31415926);

			for(let i = 0; i < 2000; i++) {
				const first = nextValue(random, 5, 4);
				const second = nextValue(random, 5, 4);

				const a = parseExact(first);
				const b = parseExact(second);

				const cases: [ string, Exact, string ][] = [
					[
						'add',
						referenceAdd(a, b),
						add(Decimal.parse(first), Decimal.parse(second)).toString()
					],
					[
						'subtract',
						referenceSubtract(a, b),
						subtract(Decimal.parse(first), Decimal.parse(second)).toString()
					],
					[
						'multiply',
						referenceMultiply(a, b),
						multiply(Decimal.parse(first), Decimal.parse(second)).toString()
					],
					[
						'add, big',
						referenceAdd(a, b),
						add(BigDecimal.parse(first), BigDecimal.parse(second)).toString()
					],
					[
						'subtract, big',
						referenceSubtract(a, b),
						subtract(BigDecimal.parse(first), BigDecimal.parse(second)).toString()
					],
					[
						'multiply, big',
						referenceMultiply(a, b),
						multiply(BigDecimal.parse(first), BigDecimal.parse(second)).toString()
					]
				];

				for(const [ name, expected, actual ] of cases) {
					expect(
						isSameValue(parseExact(actual), expected),
						name + '(' + first + ', ' + second + ') gave ' + actual
							+ ', expected ' + toExactString(expected)
					).toEqual(true);
				}
			}
		});

		it('the two implementations agree on precision', function() {
			const random = createRandom(27182818);

			for(let i = 0; i < 2000; i++) {
				const input = nextValue(random, 6, 4);
				const precision = 1 + Math.floor(random() * 6);
				const mode = MODES[Math.floor(random() * MODES.length)];
				const context = MathContext.ofPrecision(precision, mode);

				const normal = scale(Decimal.parse(input), context);
				const big = scale(BigDecimal.parse(input), context);

				const message = 'precision(' + input + ', ' + precision + ', ' + mode + ')';

				expect(normal.toString(), message).toEqual(big.toString());

				/*
				 * The coefficient holds the significant digits. The string
				 * form can not be used here, as the trailing zero of a value
				 * such as `940` is a placeholder and not a digit that was
				 * kept.
				 */
				expect(
					significantDigits(normal),
					message + ' gave ' + normal.toString()
				).toBeLessThanOrEqual(precision);

				expect(
					significantDigits(big),
					message + ' gave ' + big.toString()
				).toBeLessThanOrEqual(precision);
			}
		});
	});
});
