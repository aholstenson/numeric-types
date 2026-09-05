import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathContext } from '../../src/MathContext.js';
import { MathError } from '../../src/MathError.js';
import { RoundingMode } from '../../src/RoundingMode.js';

import { pow } from '../../src/decimal/pow.js';

type Parser = (input: string) => Decimal | BigDecimal;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Decimal.parse(input) ],
	[ 'Big', input => BigDecimal.parse(input) ]
];

describe('Decimal', function() {
	describe('pow', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				const cases: [ string, number, string ][] = [
					[ '2', 10, '1024' ],
					[ '2', 1, '2' ],
					[ '2', 0, '1' ],
					[ '0', 0, '1' ],
					[ '0', 3, '0' ],
					[ '1.1', 2, '1.21' ],
					[ '1.5', 2, '2.25' ],
					[ '-2', 3, '-8' ],
					[ '-2', 2, '4' ],
					[ '10', 3, '1000' ],
					[ '0.5', 3, '0.125' ],
					[ '1e2', 2, '10000' ]
				];

				for(const [ a, exponent, expected ] of cases) {
					it(a + ' ** ' + exponent + ' = ' + expected, function() {
						expect(pow(parse(a), exponent).toString()).toEqual(expected);
					});
				}

				it('removes trailing zeroes without a context', function() {
					expect(pow(parse('1.50'), 2).toString()).toEqual('2.25');
				});

				it('a context sets the scale of the result', function() {
					const r = pow(parse('1.1'), 3, MathContext.ofScale(2, RoundingMode.HalfUp));
					expect(r.toString()).toEqual('1.33');
				});

				it('a context sets the scale of a power of zero', function() {
					const r = pow(parse('7'), 0, MathContext.ofScale(2, RoundingMode.HalfUp));
					expect(r.toString()).toEqual('1.00');
				});

				it('a negative exponent divides, so 2 ** -2 = 0.25', function() {
					const r = pow(parse('2'), -2, MathContext.ofScale(2, RoundingMode.HalfUp));
					expect(r.toString()).toEqual('0.25');
				});

				it('a negative exponent rounds as the context asks', function() {
					const r = pow(parse('3'), -1, MathContext.ofScale(4, RoundingMode.HalfUp));
					expect(r.toString()).toEqual('0.3333');
				});

				it('a negative exponent without a context throws', function() {
					expect(function() {
						pow(parse('2'), -2);
					}).toThrow(MathError);
				});

				it('a negative exponent of zero throws', function() {
					expect(function() {
						pow(parse('0'), -1, MathContext.ofScale(2, RoundingMode.HalfUp));
					}).toThrow(MathError);
				});

				for(const exponent of [ 1.5, NaN, Infinity, Number.MAX_VALUE ]) {
					it('rejects the exponent ' + exponent, function() {
						expect(function() {
							pow(parse('2'), exponent);
						}).toThrow(MathError);
					});
				}
			});
		}

		describe('Normal', function() {
			it('throws when the result needs more digits than a number holds', function() {
				expect(function() {
					pow(Decimal.parse('2'), 60);
				}).toThrow(MathError);
			});
		});

		describe('Big', function() {
			it('handles a result that is larger than a number', function() {
				expect(pow(BigDecimal.parse('2'), 64).toString())
					.toEqual('18446744073709551616');
			});

			it('keeps every digit of a fraction, so 1.0001 ** 4 is exact', function() {
				expect(pow(BigDecimal.parse('1.0001'), 4).toString())
					.toEqual('1.0004000600040001');
			});
		});
	});
});
