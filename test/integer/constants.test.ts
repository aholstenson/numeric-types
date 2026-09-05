import { Integer, BigInteger, add, isEqual } from '../../src/integer/index.js';

type IntegerType = {
	readonly ZERO: Integer | BigInteger;
	readonly ONE: Integer | BigInteger;
	readonly MINUS_ONE: Integer | BigInteger;
	readonly TWO: Integer | BigInteger;
	readonly TEN: Integer | BigInteger;
	parse(input: string): Integer | BigInteger;
};

const implementations: [ string, IntegerType ][] = [
	[ 'Normal', Integer ],
	[ 'Big', BigInteger ]
];

/*
 * The constants are shared instances, so they must describe the same value as
 * the parsed form and stay usable together with values of their own type.
 */
describe('Integer', function() {
	for(const [ name, type ] of implementations) {
		describe(name, function() {
			describe('constants', function() {
				const values: [ string, Integer | BigInteger, string ][] = [
					[ 'ZERO', type.ZERO, '0' ],
					[ 'ONE', type.ONE, '1' ],
					[ 'MINUS_ONE', type.MINUS_ONE, '-1' ],
					[ 'TWO', type.TWO, '2' ],
					[ 'TEN', type.TEN, '10' ]
				];

				for(const [ constant, value, expected ] of values) {
					it(constant + ' is ' + expected, function() {
						expect(value.toString()).toEqual(expected);
					});

					it(constant + ' equals the parsed value', function() {
						expect(isEqual(value, type.parse(expected))).toBe(true);
					});
				}

				it('returns the same instance every time', function() {
					expect(type.ONE).toBe(type.ONE);
				});

				it('can be used in an operation', function() {
					expect(add(type.parse('41'), type.ONE).toString()).toEqual('42');
				});
			});
		});
	}
});
