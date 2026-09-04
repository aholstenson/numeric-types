import {
	Integer,
	BigInteger,
	bitwiseAnd,
	bitwiseOr,
	bitwiseNot,
	leftShift,
	signedRightShift
} from '../../src/integer/index.js';
import { MathError } from '../../src/MathError.js';

type Parser = (input: string) => Integer | BigInteger;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Integer.parse(input) ],
	[ 'Big', input => BigInteger.parse(input) ]
];

/*
 * Bitwise operations must cover the whole range of the type, and not only the
 * 32 bits that the JavaScript operators work on.
 */
describe('Integer', function() {
	describe('Bitwise', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				it('4 << 1 = 8', function() {
					expect(leftShift(parse('4'), 1).toString()).toEqual('8');
				});

				it('2^40 << 1 = 2^41', function() {
					expect(leftShift(parse('1099511627776'), 1).toString()).toEqual('2199023255552');
				});

				it('2^40 >> 1 = 2^39', function() {
					expect(signedRightShift(parse('1099511627776'), 1).toString()).toEqual('549755813888');
				});

				it('~2^40', function() {
					expect(bitwiseNot(parse('1099511627776')).toString()).toEqual('-1099511627777');
				});

				it('2^40 & 2^40 = 2^40', function() {
					const a = parse('1099511627776');
					expect(bitwiseAnd(a, a).toString()).toEqual('1099511627776');
				});

				it('2^40 & 1 = 0', function() {
					expect(bitwiseAnd(parse('1099511627776'), parse('1')).toString()).toEqual('0');
				});

				it('2^40 | 1 = 2^40 + 1', function() {
					expect(bitwiseOr(parse('1099511627776'), parse('1')).toString()).toEqual('1099511627777');
				});

				it('-8 >> 2 = -2', function() {
					expect(signedRightShift(parse('-8'), 2).toString()).toEqual('-2');
				});
			});
		}

		describe('Normal', function() {
			it('a shift beyond the safe range throws', function() {
				expect(function() {
					leftShift(Integer.parse('1099511627776'), 40);
				}).toThrow(MathError);
			});
		});
	});
});
