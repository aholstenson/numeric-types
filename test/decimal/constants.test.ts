import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';

import { add } from '../../src/decimal/add.js';
import { isEqual } from '../../src/decimal/compare.js';

type DecimalType = {
	readonly ZERO: Decimal | BigDecimal;
	readonly ONE: Decimal | BigDecimal;
	readonly MINUS_ONE: Decimal | BigDecimal;
	readonly TWO: Decimal | BigDecimal;
	readonly TEN: Decimal | BigDecimal;
	parse(input: string): Decimal | BigDecimal;
};

const implementations: [ string, DecimalType ][] = [
	[ 'Normal', Decimal ],
	[ 'Big', BigDecimal ]
];

/*
 * The constants are shared instances, so they must describe the same value as
 * the parsed form and stay usable together with values of their own type.
 */
describe('Decimal', function() {
	for(const [ name, type ] of implementations) {
		describe(name, function() {
			describe('constants', function() {
				const values: [ string, Decimal | BigDecimal, string ][] = [
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
					expect(add(type.parse('1.25'), type.ONE).toString()).toEqual('2.25');
				});
			});
		});
	}
});
