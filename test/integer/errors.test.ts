import {
	Integer,
	BigInteger,
	add,
	subtract,
	multiply,
	divide,
	remainder,
	exponentiate,
	compare,
	bitwiseAnd,
	bitwiseOr
} from '../../src/integer/index.js';
import { MathError } from '../../src/MathError.js';

type Parser = (input: string) => Integer | BigInteger;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Integer.parse(input) ],
	[ 'Big', input => BigInteger.parse(input) ]
];

/*
 * The two integer types must accept the same input, reject the same input,
 * and fail in the same way.
 */
describe('Integer', function() {
	describe('Errors', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				describe('parse', function() {
					it('reads a positive number', function() {
						expect(parse('12').toString()).toEqual('12');
					});

					it('reads a negative number', function() {
						expect(parse('-12').toString()).toEqual('-12');
					});

					it('ignores surrounding whitespace', function() {
						expect(parse('  12  ').toString()).toEqual('12');
					});

					for(const input of [ '', '   ', 'abc', '12abc', '1.2', '1.2.3', '0x10', 'Infinity', '1e3' ]) {
						it('rejects ' + JSON.stringify(input), function() {
							expect(function() {
								parse(input);
							}).toThrow(MathError);
						});
					}
				});

				describe('divide', function() {
					it('truncates towards zero for -7 / 2', function() {
						expect(divide(parse('-7'), parse('2')).toString()).toEqual('-3');
					});

					it('truncates towards zero for 7 / -2', function() {
						expect(divide(parse('7'), parse('-2')).toString()).toEqual('-3');
					});

					it('truncates towards zero for 7 / 2', function() {
						expect(divide(parse('7'), parse('2')).toString()).toEqual('3');
					});

					it('rejects a divisor of zero', function() {
						expect(function() {
							divide(parse('1'), parse('0'));
						}).toThrow(MathError);
					});
				});

				describe('remainder', function() {
					it('keeps the sign of the first number', function() {
						expect(remainder(parse('-7'), parse('2')).toString()).toEqual('-1');
						expect(remainder(parse('7'), parse('2')).toString()).toEqual('1');
					});

					it('agrees with divide', function() {
						const a = parse('-7');
						const b = parse('2');
						const rebuilt = add(multiply(divide(a, b), b), remainder(a, b));
						expect(rebuilt.toString()).toEqual('-7');
					});

					it('rejects a divisor of zero', function() {
						expect(function() {
							remainder(parse('1'), parse('0'));
						}).toThrow(MathError);
					});
				});

				describe('exponentiate', function() {
					it('rejects a negative exponent', function() {
						expect(function() {
							exponentiate(parse('2'), parse('-1'));
						}).toThrow(MathError);
					});

					it('allows an exponent of zero', function() {
						expect(exponentiate(parse('2'), parse('0')).toString()).toEqual('1');
					});
				});
			});
		}

		describe('Mixed types', function() {
			const first = Integer.parse('1');
			const second = BigInteger.parse('1');

			const operations: [ string, () => unknown ][] = [
				[ 'add', () => add(first as never, second as never) ],
				[ 'subtract', () => subtract(first as never, second as never) ],
				[ 'multiply', () => multiply(first as never, second as never) ],
				[ 'divide', () => divide(first as never, second as never) ],
				[ 'remainder', () => remainder(first as never, second as never) ],
				[ 'exponentiate', () => exponentiate(first as never, second as never) ],
				[ 'compare', () => compare(first as never, second as never) ],
				[ 'bitwiseAnd', () => bitwiseAnd(first as never, second as never) ],
				[ 'bitwiseOr', () => bitwiseOr(first as never, second as never) ]
			];

			for(const [ name, operation ] of operations) {
				it(name + ' rejects an Integer mixed with a BigInteger', function() {
					expect(operation).toThrow(MathError);
				});
			}
		});

		describe('fromNumber', function() {
			it('Integer rejects a fraction', function() {
				expect(function() {
					Integer.fromNumber(1.5);
				}).toThrow(MathError);
			});

			it('BigInteger rejects a fraction', function() {
				expect(function() {
					BigInteger.fromNumber(1.5);
				}).toThrow(MathError);
			});

			it('Integer rejects a value outside the safe range', function() {
				expect(function() {
					Integer.fromNumber(2 ** 60);
				}).toThrow(MathError);
			});

			it('BigInteger accepts a value outside the safe range', function() {
				expect(BigInteger.fromNumber(2 ** 60).toString()).toEqual('1152921504606846976');
			});

			for(const value of [ NaN, Infinity, -Infinity ]) {
				it('Integer rejects ' + value, function() {
					expect(function() {
						Integer.fromNumber(value);
					}).toThrow(MathError);
				});

				it('BigInteger rejects ' + value, function() {
					expect(function() {
						BigInteger.fromNumber(value);
					}).toThrow(MathError);
				});
			}
		});

		describe('parse of large values', function() {
			it('Integer rejects a value outside the safe range', function() {
				expect(function() {
					Integer.parse('9007199254740993');
				}).toThrow(MathError);
			});

			it('BigInteger keeps every digit', function() {
				expect(BigInteger.parse('9007199254740993').toString()).toEqual('9007199254740993');
			});
		});
	});
});
