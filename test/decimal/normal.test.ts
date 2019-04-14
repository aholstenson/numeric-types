import { Decimal } from '../../src/decimal/decimal-normal';
import { RoundingMode } from '../../src/rounding-mode';

import { add } from '../../src/decimal/add';
import { subtract } from '../../src/decimal/subtract';
import { multiply } from '../../src/decimal/multiply';
import { divide } from '../../src/decimal/divide';
import { compare } from '../../src/decimal/compare';

describe('Decimal', function() {
	describe('Normal', function() {
		describe('add', function() {
			it('1 + 1 = 2', function() {
				const a = Decimal.fromNumber(1);
				const b = Decimal.fromNumber(1);
				const r = add(a, b);
				expect(r.toString()).toEqual('2');
			});

			it('1.2 + 1 = 2.2', function() {
				const a = Decimal.fromNumber(1.2);
				const b = Decimal.fromNumber(1);
				const r = add(a, b);
				expect(r.toString()).toEqual('2.2');
			});

			it('1 + 1.2 = 2.2', function() {
				const a = Decimal.fromNumber(1);
				const b = Decimal.fromNumber(1.2);
				const r = add(a, b);
				expect(r.toString()).toEqual('2.2');
			});

			it('1e-2 + 1e-4 = 1.0101', function() {
				const a = Decimal.parse('1e-2');
				const b = Decimal.parse('1e-4');
				const r = add(a, b);
				expect(r.toString()).toEqual('0.0101');
			});

			it('1e2 + 1e4 = 10101', function() {
				const a = Decimal.parse('1e2');
				const b = Decimal.parse('1e4');
				const r = add(a, b);
				expect(r.toString()).toEqual('10100');
			});

			it('1.8 + 1.2 = 3.0', function() {
				const a = Decimal.fromNumber(1.8);
				const b = Decimal.fromNumber(1.2);
				const r = add(a, b);
				expect(r.toString()).toEqual('3');
			});

			it('1.8 + -1.2 = 0.6', function() {
				const a = Decimal.fromNumber(1.8);
				const b = Decimal.fromNumber(-1.2);
				const r = add(a, b);
				expect(r.toString()).toEqual('0.6');
			});

			it('1.08 + 1.02 = 2.1', function() {
				const a = Decimal.fromNumber(1.08);
				const b = Decimal.fromNumber(1.02);
				const r = add(a, b);
				expect(r.toString()).toEqual('2.1');
			});

			it('1.08 + 1.02 = 2.1, scale=2', function() {
				const a = Decimal.fromNumber(1.08);
				const b = Decimal.fromNumber(1.02);
				const r = add(a, b, { scale: 2, roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('2.10');
			});
		});

		describe('subtract', function() {
			it('2 - 1 = 1', function() {
				const a = Decimal.fromNumber(2);
				const b = Decimal.fromNumber(1);
				const r = subtract(a, b);
				expect(r.toString()).toEqual('1');
			});

			it('1.2 - 1 = 0.2', function() {
				const a = Decimal.fromNumber(1.2);
				const b = Decimal.fromNumber(1);
				const r = subtract(a, b);
				expect(r.toString()).toEqual('0.2');
			});

			it('1 - 1.2 = -0.2', function() {
				const a = Decimal.fromNumber(1);
				const b = Decimal.fromNumber(1.2);
				const r = subtract(a, b);
				expect(r.toString()).toEqual('-0.2');
			});
		});

		describe('multiply', function() {
			it('2 * 1 = 2', function() {
				const a = Decimal.fromNumber(2);
				const b = Decimal.fromNumber(1);
				const r = multiply(a, b);
				expect(r.toString()).toEqual('2');
			});

			it('2.2 * 4 = 8.8', function() {
				const a = Decimal.fromNumber(2.2);
				const b = Decimal.fromNumber(4);
				const r = multiply(a, b);
				expect(r.toString()).toEqual('8.8');
			});

			it('12 * 0.1 = 1.2', function() {
				const a = Decimal.fromNumber(12);
				const b = Decimal.fromNumber(0.1);
				const r = multiply(a, b);
				expect(r.toString()).toEqual('1.2');
			});

			it('0.1 * 0.1 = 0.01', function() {
				const a = Decimal.fromNumber(0.1);
				const b = Decimal.fromNumber(0.1);
				const r = multiply(a, b);
				expect(r.toString()).toEqual('0.01');
			});
		});

		describe('divide', function() {
			it('4 / 2 = 2', function() {
				const a = Decimal.fromNumber(4);
				const b = Decimal.fromNumber(2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('2');
			});

			it('5 / 2 = 2.5', function() {
				const a = Decimal.fromNumber(5);
				const b = Decimal.fromNumber(2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('2.5');
			});

			it('5 / 2 = 2.50, scale=2', function() {
				const a = Decimal.fromNumber(5);
				const b = Decimal.fromNumber(2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down, scale: 2 });
				expect(r.toString()).toEqual('2.50');
			});

			it('-5 / 2 = -2.5', function() {
				const a = Decimal.fromNumber(-5);
				const b = Decimal.fromNumber(2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('-2.5');
			});

			it('5 / -2 = -2.5', function() {
				const a = Decimal.fromNumber(5);
				const b = Decimal.fromNumber(-2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('-2.5');
			});

			it('5 / -2 = -2.5, scale=0', function() {
				const a = Decimal.fromNumber(5);
				const b = Decimal.fromNumber(-2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down, scale: 0 });
				expect(r.toString()).toEqual('-2');
			});

			it('-5 / -2 = 2.5', function() {
				const a = Decimal.fromNumber(-5);
				const b = Decimal.fromNumber(-2);
				const r = divide(a, b, { roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('2.5');
			});

			it('5 / 1.5 = 3.33333', function() {
				const a = Decimal.fromNumber(5);
				const b = Decimal.fromNumber(1.5);
				const r = divide(a, b, { roundingMode: RoundingMode.Down });
				expect(r.toString()).toEqual('3.33333');
			});

			it('5 / 1.5 = 3, scale=0', function() {
				const a = Decimal.fromNumber(5);
				const b = Decimal.fromNumber(1.5);
				const r = divide(a, b, { roundingMode: RoundingMode.Down, scale: 0 });
				expect(r.toString()).toEqual('3');
			});
		});

		describe('compare', function() {
			it('1 == 1', function() {
				const a = Decimal.fromNumber(1);
				const b = Decimal.fromNumber(1);
				const r = compare(a, b);
				expect(r).toEqual(0);
			});

			it('2 > 1', function() {
				const a = Decimal.fromNumber(2);
				const b = Decimal.fromNumber(1);
				const r = compare(a, b);
				expect(r).toEqual(1);
			});

			it('1 < 2', function() {
				const a = Decimal.fromNumber(1);
				const b = Decimal.fromNumber(2);
				const r = compare(a, b);
				expect(r).toEqual(-1);
			});

			it('2.2 > 1.02', function() {
				const a = Decimal.fromNumber(2.2);
				const b = Decimal.fromNumber(1.02);
				const r = compare(a, b);
				expect(r).toEqual(1);
			});
		});
	});
});
