import type { DerivedOps, NumericProvider } from './NumericOps.js';

/**
 * Complete a provider so that it can be used as `NumericOps` or as
 * `IntegerOps`.
 *
 * The members of `DerivedOps` all follow from the provider, so this function
 * calculates them once instead of asking every implementation to write them.
 * The constants are built here as well, so an operation that needs ten does
 * not convert it on every call.
 *
 * A provider that has a faster way to calculate one of these members can
 * supply it, and the value it supplies is kept.
 *
 * @param provider
 *   the arithmetic to complete
 */
export function deriveOps<V, P extends NumericProvider<V>>(provider: P): P & DerivedOps<V> {
	const absolute = (a: V): V => provider.isNegative(a) ? provider.negate(a) : a;

	const derived: DerivedOps<V> = {
		ZERO: provider.fromNumber(0),
		ONE: provider.fromNumber(1),
		TWO: provider.fromNumber(2),
		TEN: provider.fromNumber(10),

		absolute,

		digits(a: V): number {
			/*
			 * The string form of a whole number holds one character per digit,
			 * so the sign is the only part that has to be removed first.
			 */
			return provider.toString(absolute(a)).length;
		},

		isMultipleOf(a: V, b: V): boolean {
			return provider.isZero(provider.remainder(a, b));
		}
	};

	return {
		...derived,
		...provider
	};
}
