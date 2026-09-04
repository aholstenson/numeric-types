import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathError } from '../../src/MathError.js';

import { add } from '../../src/decimal/add.js';
import { multiply } from '../../src/decimal/multiply.js';

/*
 * Results that end in two or more zeros are reduced until no more trailing
 * zeros remain. Every case here needs more than one pass through the
 * reduction loop.
 */
describe('Decimal', function() {
	describe('Reduction', function() {
		describe('Normal', function() {
			it('0.50 + 0.50 = 1', function() {
				const r = add(Decimal.parse('0.50'), Decimal.parse('0.50'));
				expect(r.toString()).toEqual('1');
			});

			it('1.500 + 1.500 = 3', function() {
				const r = add(Decimal.parse('1.500'), Decimal.parse('1.500'));
				expect(r.toString()).toEqual('3');
			});

			it('0.001 * 1000 = 1', function() {
				const r = multiply(Decimal.parse('0.001'), Decimal.parse('1000'));
				expect(r.toString()).toEqual('1');
			});

			it('100 + 100 = 200', function() {
				const r = add(Decimal.parse('100'), Decimal.parse('100'));
				expect(r.toString()).toEqual('200');
			});

			it('0.25 * 4 = 1', function() {
				const r = multiply(Decimal.parse('0.25'), Decimal.parse('4'));
				expect(r.toString()).toEqual('1');
			});

			it('99999999 * 99999999 is rejected as unsafe', function() {
				expect(function() {
					multiply(Decimal.parse('99999999'), Decimal.parse('99999999'));
				}).toThrow(MathError);
			});
		});

		describe('Big', function() {
			it('0.50 + 0.50 = 1', function() {
				const r = add(BigDecimal.parse('0.50'), BigDecimal.parse('0.50'));
				expect(r.toString()).toEqual('1');
			});

			it('1.500 + 1.500 = 3', function() {
				const r = add(BigDecimal.parse('1.500'), BigDecimal.parse('1.500'));
				expect(r.toString()).toEqual('3');
			});

			it('99999999 * 99999999 = 9999999800000001', function() {
				const r = multiply(BigDecimal.parse('99999999'), BigDecimal.parse('99999999'));
				expect(r.toString()).toEqual('9999999800000001');
			});
		});
	});
});
