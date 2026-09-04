import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathContext } from '../../src/MathContext.js';
import { MathError } from '../../src/MathError.js';
import { RoundingMode } from '../../src/RoundingMode.js';

import { add } from '../../src/decimal/add.js';
import { subtract } from '../../src/decimal/subtract.js';
import { multiply } from '../../src/decimal/multiply.js';
import { divide } from '../../src/decimal/divide.js';
import { compare } from '../../src/decimal/compare.js';

type Parser = (input: string) => Decimal | BigDecimal;
type Converter = (value: number) => Decimal | BigDecimal;

const implementations: [ string, Parser, Converter ][] = [
	[ 'Normal', input => Decimal.parse(input), value => Decimal.fromNumber(value) ],
	[ 'Big', input => BigDecimal.parse(input), value => BigDecimal.fromNumber(value) ]
];

/*
 * Every failure that this library reports is a `MathError`, so that a caller
 * needs to catch only one type.
 */
describe('Decimal', function() {
	describe('Errors', function() {
		for(const [ name, parse, fromNumber ] of implementations) {
			describe(name, function() {
				for(const input of [ '', '   ', 'abc', '1.2.3', '12abc', 'Infinity', '0x10', '.5' ]) {
					it('parse rejects ' + JSON.stringify(input), function() {
						expect(function() {
							parse(input);
						}).toThrow(MathError);
					});
				}

				for(const value of [ NaN, Infinity, -Infinity ]) {
					it('fromNumber rejects ' + value, function() {
						expect(function() {
							fromNumber(value);
						}).toThrow(MathError);
					});
				}
			});
		}

		describe('Mixed types', function() {
			const first = Decimal.parse('1');
			const second = BigDecimal.parse('1');
			const context = MathContext.ofScale(2, RoundingMode.HalfUp);

			const operations: [ string, () => unknown ][] = [
				[ 'add', () => add(first as never, second as never) ],
				[ 'subtract', () => subtract(first as never, second as never) ],
				[ 'multiply', () => multiply(first as never, second as never) ],
				[ 'divide', () => divide(first as never, second as never, context) ],
				[ 'compare', () => compare(first as never, second as never) ]
			];

			for(const [ name, operation ] of operations) {
				it(name + ' rejects a Decimal mixed with a BigDecimal', function() {
					expect(operation).toThrow(MathError);
				});
			}
		});
	});
});
