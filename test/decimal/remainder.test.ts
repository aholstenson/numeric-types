import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathContext } from '../../src/MathContext.js';
import { MathError } from '../../src/MathError.js';
import { RoundingMode } from '../../src/RoundingMode.js';

import { add } from '../../src/decimal/add.js';
import { multiply } from '../../src/decimal/multiply.js';
import { divide } from '../../src/decimal/divide.js';
import { remainder } from '../../src/decimal/remainder.js';
import { isEqual } from '../../src/decimal/compare.js';

type Parser = (input: string) => Decimal | BigDecimal;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Decimal.parse(input) ],
	[ 'Big', input => BigDecimal.parse(input) ]
];

/**
 * Context that keeps the whole part of a division, which is the division that
 * the remainder belongs to.
 */
const TRUNCATING = MathContext.ofScale(0, RoundingMode.Down);

describe('Decimal', function() {
	describe('remainder', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				const cases: [ string, string, string ][] = [
					[ '10', '3', '1' ],
					[ '10.5', '3', '1.5' ],
					[ '-10.5', '3', '-1.5' ],
					[ '10.5', '-3', '1.5' ],
					[ '-10.5', '-3', '-1.5' ],
					[ '1', '0.3', '0.1' ],
					[ '0.3', '1', '0.3' ],
					[ '7', '7', '0' ],
					[ '0', '5', '0' ],
					[ '2', '4', '2' ],
					[ '1e3', '7', '6' ],
					[ '12.345', '0.01', '0.005' ]
				];

				for(const [ a, b, expected ] of cases) {
					it(a + ' % ' + b + ' = ' + expected, function() {
						expect(remainder(parse(a), parse(b)).toString()).toEqual(expected);
					});
				}

				it('a context sets the scale of the result', function() {
					const r = remainder(parse('10.5'), parse('3'), MathContext.ofScale(3, RoundingMode.HalfUp));
					expect(r.toString()).toEqual('1.500');
				});

				it('a divisor of zero throws', function() {
					expect(function() {
						remainder(parse('1'), parse('0'));
					}).toThrow(MathError);
				});

				it('a divisor of 0.00 throws', function() {
					expect(function() {
						remainder(parse('1'), parse('0.00'));
					}).toThrow(MathError);
				});

				/*
				 * The remainder describes what a division leaves behind, so
				 * putting the two back together has to return the number that
				 * the division started with.
				 */
				const pairs: [ string, string ][] = [
					[ '10.5', '3' ],
					[ '-10.5', '3' ],
					[ '10.5', '-3' ],
					[ '-10.5', '-3' ],
					[ '0.001', '0.4' ],
					[ '123.456', '7.89' ],
					[ '-123.456', '7.89' ]
				];

				for(const [ a, b ] of pairs) {
					it('quotient * ' + b + ' + remainder returns ' + a, function() {
						const first = parse(a);
						const second = parse(b);

						const quotient = divide(first, second, TRUNCATING);
						const rest = remainder(first, second);

						expect(isEqual(add(multiply(quotient, second), rest), first)).toEqual(true);
					});
				}
			});
		}

		describe('Mixed types', function() {
			it('rejects a Decimal mixed with a BigDecimal', function() {
				expect(function() {
					remainder(Decimal.parse('1') as never, BigDecimal.parse('1') as never);
				}).toThrow(MathError);
			});
		});

		describe('Big', function() {
			it('handles values that are larger than a number', function() {
				const a = BigDecimal.parse('123456789012345678901234567890.5');
				const b = BigDecimal.parse('1000000000000000000000');
				expect(remainder(a, b).toString()).toEqual('12345678901234567890.5');
			});
		});
	});
});
