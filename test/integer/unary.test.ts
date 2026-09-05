import {
	Integer,
	BigInteger,
	abs,
	negate,
	unaryMinus,
	sign,
	isZero,
	min,
	max
} from '../../src/integer/index.js';
import { MathError } from '../../src/MathError.js';

type Parser = (input: string) => Integer | BigInteger;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Integer.parse(input) ],
	[ 'Big', input => BigInteger.parse(input) ]
];

/*
 * These operations do not change the digits of a number, so both types must
 * return the same answer for the same input.
 */
describe('Integer', function() {
	for(const [ name, parse ] of implementations) {
		describe(name, function() {
			describe('abs', function() {
				it('-12 becomes 12', function() {
					expect(abs(parse('-12')).toString()).toEqual('12');
				});

				it('12 stays 12', function() {
					expect(abs(parse('12')).toString()).toEqual('12');
				});

				it('0 stays 0', function() {
					expect(abs(parse('0')).toString()).toEqual('0');
				});
			});

			describe('negate', function() {
				it('12 becomes -12', function() {
					expect(negate(parse('12')).toString()).toEqual('-12');
				});

				it('-12 becomes 12', function() {
					expect(negate(parse('-12')).toString()).toEqual('12');
				});

				it('0 stays 0', function() {
					expect(negate(parse('0')).toString()).toEqual('0');
				});

				it('twice returns the original number', function() {
					expect(negate(negate(parse('-12'))).toString()).toEqual('-12');
				});

				it('unaryMinus gives the same result', function() {
					expect(unaryMinus(parse('12')).toString()).toEqual(negate(parse('12')).toString());
				});
			});

			describe('sign', function() {
				it('-12 is -1', function() {
					expect(sign(parse('-12'))).toEqual(-1);
				});

				it('12 is 1', function() {
					expect(sign(parse('12'))).toEqual(1);
				});

				it('0 is 0', function() {
					expect(sign(parse('0'))).toEqual(0);
				});
			});

			describe('isZero', function() {
				it('0 is zero', function() {
					expect(isZero(parse('0'))).toEqual(true);
				});

				it('-0 is zero', function() {
					expect(isZero(parse('-0'))).toEqual(true);
				});

				it('1 is not zero', function() {
					expect(isZero(parse('1'))).toEqual(false);
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
			});
		});
	}

	describe('Big', function() {
		it('abs works over the full range of the type', function() {
			expect(abs(BigInteger.parse('-123456789012345678901234567890')).toString())
				.toEqual('123456789012345678901234567890');
		});

		it('negate works over the full range of the type', function() {
			expect(negate(BigInteger.parse('123456789012345678901234567890')).toString())
				.toEqual('-123456789012345678901234567890');
		});
	});

	describe('Normal', function() {
		it('abs of the smallest safe integer stays safe', function() {
			expect(abs(Integer.fromNumber(Number.MIN_SAFE_INTEGER)).toString())
				.toEqual('9007199254740991');
		});
	});

	describe('Mixed types', function() {
		const first = Integer.parse('1');
		const second = BigInteger.parse('1');

		const operations: [ string, () => unknown ][] = [
			[ 'min', () => min(first as never, second as never) ],
			[ 'max', () => max(first as never, second as never) ]
		];

		for(const [ name, operation ] of operations) {
			it(name + ' rejects an Integer mixed with a BigInteger', function() {
				expect(operation).toThrow(MathError);
			});
		}
	});
});
