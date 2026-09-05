import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { Integer } from '../../src/integer/Integer.js';
import { BigInteger } from '../../src/integer/BigInteger.js';
import { MathError } from '../../src/MathError.js';

import { toNumber } from '../../src/decimal/toNumber.js';

type Parser = (input: string) => Decimal | BigDecimal;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Decimal.parse(input) ],
	[ 'Big', input => BigDecimal.parse(input) ]
];

describe('Decimal', function() {
	describe('Conversion', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				describe('toNumber', function() {
					const cases: [ string, number ][] = [
						[ '0', 0 ],
						[ '1', 1 ],
						[ '-1', -1 ],
						[ '1.5', 1.5 ],
						[ '-1.25', -1.25 ],
						[ '0.1', 0.1 ],
						[ '1e2', 100 ],
						[ '1e-3', 0.001 ],
						[ '12345.6789', 12345.6789 ],
						[ '0.00', 0 ]
					];

					for(const [ input, expected ] of cases) {
						it(input + ' becomes ' + expected, function() {
							expect(parse(input).toNumber()).toEqual(expected);
						});
					}

					it('is also available as a function', function() {
						expect(toNumber(parse('1.5'))).toEqual(1.5);
					});
				});

				describe('toJSON', function() {
					it('keeps the scale of the number', function() {
						expect(parse('1.50').toJSON()).toEqual('1.50');
					});

					it('is used by JSON.stringify', function() {
						expect(JSON.stringify(parse('-12.345'))).toEqual('"-12.345"');
					});

					it('is used for a number inside an object', function() {
						expect(JSON.stringify({ amount: parse('0.10') })).toEqual('{"amount":"0.10"}');
					});
				});

				describe('Symbol.toPrimitive', function() {
					it('a template string uses the string form', function() {
						expect(`${parse('1.50')}`).toEqual('1.50');
					});

					it('String uses the string form', function() {
						expect(String(parse('1.50'))).toEqual('1.50');
					});

					it('Number uses the number form', function() {
						expect(Number(parse('1.50'))).toEqual(1.5);
					});

					it('a unary plus uses the number form', function() {
						expect(+(parse('1.50') as unknown as number)).toEqual(1.5);
					});

					it('multiplication uses the number form', function() {
						expect((parse('1.50') as unknown as number) * 2).toEqual(3);
					});

					it('a comparison uses the number form', function() {
						const smaller = parse('1.5') as unknown as number;
						const larger = parse('2') as unknown as number;
						expect(smaller < larger).toEqual(true);
					});

					it('a plus joins strings instead of doing math', function() {
						expect('' + parse('1.50')).toEqual('1.50');
					});
				});
			});
		}

		describe('fromNumber', function() {
			/*
			 * A whole number goes straight to a coefficient, so these check
			 * that the shortcut lands on the same value as the string route.
			 */
			const cases: [ string, number, string ][] = [
				[ '0', 0, '0' ],
				[ '-0', -0, '0' ],
				[ '1', 1, '1' ],
				[ '-42', -42, '-42' ],
				[ '100', 100, '100' ],
				[ 'the largest safe integer', Number.MAX_SAFE_INTEGER, '9007199254740991' ],
				[ 'the smallest safe integer', Number.MIN_SAFE_INTEGER, '-9007199254740991' ],
				[ '0.1', 0.1, '0.1' ],
				[ '-1.25', -1.25, '-1.25' ],
				[ '1e21', 1e21, '1' + '0'.repeat(21) ]
			];

			for(const [ label, input, expected ] of cases) {
				it('Decimal reads ' + label, function() {
					expect(Decimal.fromNumber(input).toString()).toEqual(expected);
				});

				it('BigDecimal reads ' + label, function() {
					expect(BigDecimal.fromNumber(input).toString()).toEqual(expected);
				});
			}
		});

		describe('Decimal and BigDecimal', function() {
			it('a Decimal becomes a BigDecimal and keeps its scale', function() {
				expect(BigDecimal.fromDecimal(Decimal.parse('1.50')).toString()).toEqual('1.50');
			});

			it('a negative Decimal becomes a BigDecimal', function() {
				expect(BigDecimal.fromDecimal(Decimal.parse('-12.345')).toString()).toEqual('-12.345');
			});

			it('a BigDecimal becomes a Decimal and keeps its scale', function() {
				expect(Decimal.fromBigDecimal(BigDecimal.parse('1.50')).toString()).toEqual('1.50');
			});

			it('a BigDecimal with a large exponent becomes a Decimal', function() {
				expect(Decimal.fromBigDecimal(BigDecimal.parse('1e30')).toString())
					.toEqual('1' + '0'.repeat(30));
			});

			it('a BigDecimal with too many digits is rejected', function() {
				expect(function() {
					Decimal.fromBigDecimal(BigDecimal.parse('123456789012345678901234567890'));
				}).toThrow(MathError);
			});

			it('fromBigDecimal rejects a Decimal', function() {
				expect(function() {
					Decimal.fromBigDecimal(Decimal.parse('1') as never);
				}).toThrow(MathError);
			});

			it('fromDecimal rejects a BigDecimal', function() {
				expect(function() {
					BigDecimal.fromDecimal(BigDecimal.parse('1') as never);
				}).toThrow(MathError);
			});

			for(const input of [ null, undefined, 1, '1' ]) {
				it('fromBigDecimal rejects ' + JSON.stringify(input), function() {
					expect(function() {
						Decimal.fromBigDecimal(input as never);
					}).toThrow(MathError);
				});

				it('fromDecimal rejects ' + JSON.stringify(input), function() {
					expect(function() {
						BigDecimal.fromDecimal(input as never);
					}).toThrow(MathError);
				});
			}
		});

		describe('From integers', function() {
			it('an Integer becomes a Decimal', function() {
				expect(Decimal.fromInteger(Integer.fromNumber(42)).toString()).toEqual('42');
			});

			it('a negative Integer becomes a Decimal', function() {
				expect(Decimal.fromInteger(Integer.fromNumber(-42)).toString()).toEqual('-42');
			});

			it('fromInteger rejects a BigInteger', function() {
				expect(function() {
					Decimal.fromInteger(BigInteger.fromNumber(42) as never);
				}).toThrow(MathError);
			});

			it('a BigInteger becomes a BigDecimal', function() {
				const value = BigInteger.parse('123456789012345678901234567890');
				expect(BigDecimal.fromBigInteger(value).toString())
					.toEqual('123456789012345678901234567890');
			});

			it('fromBigInteger rejects an Integer', function() {
				expect(function() {
					BigDecimal.fromBigInteger(Integer.fromNumber(42) as never);
				}).toThrow(MathError);
			});

			it('a bigint becomes a BigDecimal', function() {
				expect(BigDecimal.fromBigInt(123456789012345678901234567890n).toString())
					.toEqual('123456789012345678901234567890');
			});

			it('a negative bigint becomes a BigDecimal', function() {
				expect(BigDecimal.fromBigInt(-42n).toString()).toEqual('-42');
			});

			for(const input of [ null, undefined, 1, '1' ]) {
				it('fromBigInt rejects ' + JSON.stringify(input), function() {
					expect(function() {
						BigDecimal.fromBigInt(input as never);
					}).toThrow(MathError);
				});
			}
		});

		describe('Big', function() {
			it('toNumber loses digits that a number can not hold', function() {
				expect(BigDecimal.parse('0.12345678901234567890').toNumber())
					.toEqual(0.12345678901234568);
			});

			it('toNumber returns Infinity for a value that is too large', function() {
				expect(BigDecimal.parse('1e400').toNumber()).toEqual(Infinity);
			});

			it('toJSON keeps digits that a number can not hold', function() {
				expect(BigDecimal.parse('0.12345678901234567890').toJSON())
					.toEqual('0.12345678901234567890');
			});
		});
	});
});
