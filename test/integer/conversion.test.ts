import { Integer, BigInteger, toNumber } from '../../src/integer/index.js';
import { MathError } from '../../src/MathError.js';

type Parser = (input: string) => Integer | BigInteger;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Integer.parse(input) ],
	[ 'Big', input => BigInteger.parse(input) ]
];

describe('Integer', function() {
	describe('Conversion', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				describe('toNumber', function() {
					const cases: [ string, number ][] = [
						[ '0', 0 ],
						[ '42', 42 ],
						[ '-42', -42 ],
						[ '9007199254740991', Number.MAX_SAFE_INTEGER ],
						[ '-9007199254740991', Number.MIN_SAFE_INTEGER ]
					];

					for(const [ input, expected ] of cases) {
						it(input + ' becomes ' + expected, function() {
							expect(parse(input).toNumber()).toEqual(expected);
						});
					}

					it('is also available as a function', function() {
						expect(toNumber(parse('42'))).toEqual(42);
					});
				});

				describe('toJSON', function() {
					it('gives the string form', function() {
						expect(parse('-42').toJSON()).toEqual('-42');
					});

					it('is used by JSON.stringify', function() {
						expect(JSON.stringify(parse('-42'))).toEqual('"-42"');
					});

					it('is used for a number inside an object', function() {
						expect(JSON.stringify({ count: parse('42') })).toEqual('{"count":"42"}');
					});
				});

				describe('Symbol.toPrimitive', function() {
					it('a template string uses the string form', function() {
						expect(`${parse('42')}`).toEqual('42');
					});

					it('String uses the string form', function() {
						expect(String(parse('42'))).toEqual('42');
					});

					it('Number uses the number form', function() {
						expect(Number(parse('42'))).toEqual(42);
					});

					it('a unary plus uses the number form', function() {
						expect(+(parse('42') as unknown as number)).toEqual(42);
					});

					it('a comparison uses the number form', function() {
						const smaller = parse('1') as unknown as number;
						const larger = parse('2') as unknown as number;
						expect(smaller < larger).toEqual(true);
					});

					it('a plus joins strings instead of doing math', function() {
						expect('' + parse('42')).toEqual('42');
					});
				});
			});
		}

		describe('Integer and BigInteger', function() {
			it('an Integer becomes a BigInteger', function() {
				expect(BigInteger.fromInteger(Integer.fromNumber(42)).toString()).toEqual('42');
			});

			it('a negative Integer becomes a BigInteger', function() {
				expect(BigInteger.fromInteger(Integer.fromNumber(-42)).toString()).toEqual('-42');
			});

			it('the largest safe Integer becomes a BigInteger', function() {
				expect(BigInteger.fromInteger(Integer.fromNumber(Number.MAX_SAFE_INTEGER)).toString())
					.toEqual('9007199254740991');
			});

			it('a BigInteger becomes an Integer', function() {
				expect(Integer.fromBigInteger(BigInteger.fromNumber(42)).toString()).toEqual('42');
			});

			it('a BigInteger outside the safe range is rejected', function() {
				expect(function() {
					Integer.fromBigInteger(BigInteger.parse('9007199254740992'));
				}).toThrow(MathError);
			});

			it('a negative BigInteger outside the safe range is rejected', function() {
				expect(function() {
					Integer.fromBigInteger(BigInteger.parse('-9007199254740992'));
				}).toThrow(MathError);
			});

			it('fromBigInteger rejects an Integer', function() {
				expect(function() {
					Integer.fromBigInteger(Integer.fromNumber(1) as never);
				}).toThrow(MathError);
			});

			it('fromInteger rejects a BigInteger', function() {
				expect(function() {
					BigInteger.fromInteger(BigInteger.fromNumber(1) as never);
				}).toThrow(MathError);
			});

			for(const input of [ null, undefined, 1, '1' ]) {
				it('fromBigInteger rejects ' + JSON.stringify(input), function() {
					expect(function() {
						Integer.fromBigInteger(input as never);
					}).toThrow(MathError);
				});

				it('fromInteger rejects ' + JSON.stringify(input), function() {
					expect(function() {
						BigInteger.fromInteger(input as never);
					}).toThrow(MathError);
				});
			}
		});

		describe('fromBigInt', function() {
			it('reads a bigint', function() {
				expect(BigInteger.fromBigInt(42n).toString()).toEqual('42');
			});

			it('reads a negative bigint', function() {
				expect(BigInteger.fromBigInt(-42n).toString()).toEqual('-42');
			});

			it('reads a bigint that is larger than a number', function() {
				expect(BigInteger.fromBigInt(123456789012345678901234567890n).toString())
					.toEqual('123456789012345678901234567890');
			});

			for(const input of [ null, undefined, 1, '1' ]) {
				it('rejects ' + JSON.stringify(input), function() {
					expect(function() {
						BigInteger.fromBigInt(input as never);
					}).toThrow(MathError);
				});
			}
		});

		describe('Big', function() {
			it('toNumber loses digits outside the safe range', function() {
				expect(BigInteger.parse('9007199254740993').toNumber())
					.toEqual(9007199254740992);
			});

			it('toJSON keeps digits that a number can not hold', function() {
				expect(BigInteger.parse('123456789012345678901234567890').toJSON())
					.toEqual('123456789012345678901234567890');
			});
		});
	});
});
