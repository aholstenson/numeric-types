import {
	Integer,
	BigInteger,
	compare,
	isEqual,
	isLessThan,
	isLessThanOrEqual,
	isGreaterThan,
	isGreaterThanOrEqual
} from '../../src/integer/index.js';

type Parser = (input: string) => Integer | BigInteger;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Integer.parse(input) ],
	[ 'Big', input => BigInteger.parse(input) ]
];

/*
 * Both integer implementations must agree, so every case runs against both.
 */
describe('Integer', function() {
	describe('Compare', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				it('5 > 3', function() {
					const a = parse('5');
					const b = parse('3');

					expect(compare(a, b)).toEqual(1);
					expect(isEqual(a, b)).toEqual(false);
					expect(isLessThan(a, b)).toEqual(false);
					expect(isLessThanOrEqual(a, b)).toEqual(false);
					expect(isGreaterThan(a, b)).toEqual(true);
					expect(isGreaterThanOrEqual(a, b)).toEqual(true);
				});

				it('3 < 5', function() {
					const a = parse('3');
					const b = parse('5');

					expect(compare(a, b)).toEqual(-1);
					expect(isEqual(a, b)).toEqual(false);
					expect(isLessThan(a, b)).toEqual(true);
					expect(isLessThanOrEqual(a, b)).toEqual(true);
					expect(isGreaterThan(a, b)).toEqual(false);
					expect(isGreaterThanOrEqual(a, b)).toEqual(false);
				});

				it('4 == 4', function() {
					const a = parse('4');
					const b = parse('4');

					expect(compare(a, b)).toEqual(0);
					expect(isEqual(a, b)).toEqual(true);
					expect(isLessThan(a, b)).toEqual(false);
					expect(isLessThanOrEqual(a, b)).toEqual(true);
					expect(isGreaterThan(a, b)).toEqual(false);
					expect(isGreaterThanOrEqual(a, b)).toEqual(true);
				});

				it('-1 < 1', function() {
					expect(compare(parse('-1'), parse('1'))).toEqual(-1);
				});

				it('1 > -1', function() {
					expect(compare(parse('1'), parse('-1'))).toEqual(1);
				});

				it('sorts in ascending order', function() {
					const values = [ parse('3'), parse('-2'), parse('10'), parse('0') ];
					const sorted = [ ...values ].sort(compare);
					expect(sorted.map(v => v.toString())).toEqual([ '-2', '0', '3', '10' ]);
				});
			});
		}
	});
});
