import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathError } from '../../src/MathError.js';

import { abs } from '../../src/decimal/abs.js';
import { negate } from '../../src/decimal/negate.js';
import { sign } from '../../src/decimal/sign.js';
import { isZero } from '../../src/decimal/isZero.js';
import { min, max } from '../../src/decimal/minMax.js';

type Parser = (input: string) => Decimal | BigDecimal;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Decimal.parse(input) ],
	[ 'Big', input => BigDecimal.parse(input) ]
];

/*
 * These operations do not change the digits of a number, so both types must
 * return the same answer for the same input.
 */
describe('Decimal', function() {
	for(const [ name, parse ] of implementations) {
		describe(name, function() {
			describe('abs', function() {
				it('-1.5 becomes 1.5', function() {
					expect(abs(parse('-1.5')).toString()).toEqual('1.5');
				});

				it('1.5 stays 1.5', function() {
					expect(abs(parse('1.5')).toString()).toEqual('1.5');
				});

				it('0 stays 0', function() {
					expect(abs(parse('0')).toString()).toEqual('0');
				});

				it('keeps the scale, so -1.50 becomes 1.50', function() {
					expect(abs(parse('-1.50')).toString()).toEqual('1.50');
				});

				it('keeps a positive exponent, so -1e3 becomes 1000', function() {
					expect(abs(parse('-1e3')).toString()).toEqual('1000');
				});
			});

			describe('negate', function() {
				it('1.5 becomes -1.5', function() {
					expect(negate(parse('1.5')).toString()).toEqual('-1.5');
				});

				it('-1.5 becomes 1.5', function() {
					expect(negate(parse('-1.5')).toString()).toEqual('1.5');
				});

				it('0 stays 0', function() {
					expect(negate(parse('0')).toString()).toEqual('0');
				});

				it('keeps the scale, so 1.50 becomes -1.50', function() {
					expect(negate(parse('1.50')).toString()).toEqual('-1.50');
				});

				it('twice returns the original number', function() {
					expect(negate(negate(parse('-12.34'))).toString()).toEqual('-12.34');
				});
			});

			describe('sign', function() {
				it('-1.5 is -1', function() {
					expect(sign(parse('-1.5'))).toEqual(-1);
				});

				it('1.5 is 1', function() {
					expect(sign(parse('1.5'))).toEqual(1);
				});

				it('0 is 0', function() {
					expect(sign(parse('0'))).toEqual(0);
				});

				it('0.00 is 0', function() {
					expect(sign(parse('0.00'))).toEqual(0);
				});

				it('-0.0001 is -1', function() {
					expect(sign(parse('-0.0001'))).toEqual(-1);
				});
			});

			describe('isZero', function() {
				it('0 is zero', function() {
					expect(isZero(parse('0'))).toEqual(true);
				});

				it('0.00 is zero', function() {
					expect(isZero(parse('0.00'))).toEqual(true);
				});

				it('0e10 is zero', function() {
					expect(isZero(parse('0e10'))).toEqual(true);
				});

				it('-0 is zero', function() {
					expect(isZero(parse('-0'))).toEqual(true);
				});

				it('0.0001 is not zero', function() {
					expect(isZero(parse('0.0001'))).toEqual(false);
				});

				it('-1 is not zero', function() {
					expect(isZero(parse('-1'))).toEqual(false);
				});
			});

			describe('min', function() {
				it('min of 1 and 2 is 1', function() {
					expect(min(parse('1'), parse('2')).toString()).toEqual('1');
				});

				it('min of 2 and 1 is 1', function() {
					expect(min(parse('2'), parse('1')).toString()).toEqual('1');
				});

				it('min of -2 and 1 is -2', function() {
					expect(min(parse('-2'), parse('1')).toString()).toEqual('-2');
				});

				it('min compares the value and not the scale', function() {
					expect(min(parse('1.5'), parse('1.05')).toString()).toEqual('1.05');
				});

				it('min returns the first number when both are equal', function() {
					expect(min(parse('1.0'), parse('1.00')).toString()).toEqual('1.0');
				});
			});

			describe('max', function() {
				it('max of 1 and 2 is 2', function() {
					expect(max(parse('1'), parse('2')).toString()).toEqual('2');
				});

				it('max of 2 and 1 is 2', function() {
					expect(max(parse('2'), parse('1')).toString()).toEqual('2');
				});

				it('max of -2 and -1 is -1', function() {
					expect(max(parse('-2'), parse('-1')).toString()).toEqual('-1');
				});

				it('max compares the value and not the scale', function() {
					expect(max(parse('1.5'), parse('1.05')).toString()).toEqual('1.5');
				});

				it('max returns the first number when both are equal', function() {
					expect(max(parse('1.0'), parse('1.00')).toString()).toEqual('1.0');
				});
			});
		});
	}

	describe('Mixed types', function() {
		const first = Decimal.parse('1');
		const second = BigDecimal.parse('1');

		const operations: [ string, () => unknown ][] = [
			[ 'min', () => min(first as never, second as never) ],
			[ 'max', () => max(first as never, second as never) ]
		];

		for(const [ name, operation ] of operations) {
			it(name + ' rejects a Decimal mixed with a BigDecimal', function() {
				expect(operation).toThrow(MathError);
			});
		}
	});
});
