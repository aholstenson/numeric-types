import { Integer, BigInteger, pow, exponentiate } from '../../src/integer/index.js';
import { MathError } from '../../src/MathError.js';

type Parser = (input: string) => Integer | BigInteger;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Integer.parse(input) ],
	[ 'Big', input => BigInteger.parse(input) ]
];

describe('Integer', function() {
	describe('pow', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				const cases: [ string, number, string ][] = [
					[ '2', 10, '1024' ],
					[ '2', 1, '2' ],
					[ '2', 0, '1' ],
					[ '0', 0, '1' ],
					[ '0', 5, '0' ],
					[ '-2', 3, '-8' ],
					[ '-2', 2, '4' ],
					[ '10', 6, '1000000' ]
				];

				for(const [ a, exponent, expected ] of cases) {
					it(a + ' ** ' + exponent + ' = ' + expected, function() {
						expect(pow(parse(a), exponent).toString()).toEqual(expected);
					});
				}

				it('matches exponentiate for the same exponent', function() {
					const a = parse('7');
					expect(pow(a, 5).toString()).toEqual(exponentiate(a, parse('5') as never).toString());
				});

				it('a negative exponent throws', function() {
					expect(function() {
						pow(parse('2'), -1);
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
			it('throws when the result leaves the safe range', function() {
				expect(function() {
					pow(Integer.fromNumber(2), 100);
				}).toThrow(MathError);
			});
		});

		describe('Big', function() {
			it('handles a result that is larger than a number', function() {
				expect(pow(BigInteger.fromNumber(2), 100).toString())
					.toEqual('1267650600228229401496703205376');
			});
		});
	});
});
