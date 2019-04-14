import { BaseDecimal } from './decimal-base';
import { validateCompatible } from './validateCompatible';
import { SPI } from './ops/symbols';
import { compareOp } from './ops/compare';

export function compare<D extends BaseDecimal<any>>(a: D, b: D): number {
	validateCompatible(a, b);
	return compareOp(a[SPI], a, b);
}

export function isEqual<D extends BaseDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) === 0;
}

export function isLessThan<D extends BaseDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) < 0;
}

export function isLessThanOrEqual<D extends BaseDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) <= 0;
}

export function isGreaterThan<D extends BaseDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) > 0;
}

export function isGreaterThanOrEqual<D extends BaseDecimal<any>>(a: D, b: D): boolean {
	return compare(a, b) >= 0;
}
