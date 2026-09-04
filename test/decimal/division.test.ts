import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathContext } from '../../src/MathContext.js';
import { MathError } from '../../src/MathError.js';
import { RoundingMode } from '../../src/RoundingMode.js';

import { divide } from '../../src/decimal/divide.js';

type Parser = (input: string) => Decimal | BigDecimal;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Decimal.parse(input) ],
	[ 'Big', input => BigDecimal.parse(input) ]
];

/*
 * Both decimal implementations must agree, so every case runs against both.
 */
describe('Decimal', function() {
	describe('Division', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				describe('Rounding of the remainder', function() {
					it('2 / 3 to scale 2 HalfUp = 0.67', function() {
						const r = divide(parse('2'), parse('3'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.67');
					});

					it('2 / 3 to scale 2 Down = 0.66', function() {
						const r = divide(parse('2'), parse('3'), MathContext.ofScale(2, RoundingMode.Down));
						expect(r.toString()).toEqual('0.66');
					});

					it('1 / 3 to scale 2 HalfUp = 0.33', function() {
						const r = divide(parse('1'), parse('3'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.33');
					});

					it('1 / 8 to scale 2 HalfUp = 0.13', function() {
						const r = divide(parse('1'), parse('8'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.13');
					});

					it('1 / 8 to scale 2 HalfDown = 0.12', function() {
						const r = divide(parse('1'), parse('8'), MathContext.ofScale(2, RoundingMode.HalfDown));
						expect(r.toString()).toEqual('0.12');
					});

					it('1 / 8 to scale 2 HalfEven = 0.12', function() {
						const r = divide(parse('1'), parse('8'), MathContext.ofScale(2, RoundingMode.HalfEven));
						expect(r.toString()).toEqual('0.12');
					});

					it('3 / 8 to scale 2 HalfEven = 0.38', function() {
						const r = divide(parse('3'), parse('8'), MathContext.ofScale(2, RoundingMode.HalfEven));
						expect(r.toString()).toEqual('0.38');
					});

					it('10 / 4 to scale 0 HalfEven = 2', function() {
						const r = divide(parse('10'), parse('4'), MathContext.ofScale(0, RoundingMode.HalfEven));
						expect(r.toString()).toEqual('2');
					});

					it('1 / 3 to scale 2 Ceiling = 0.34', function() {
						const r = divide(parse('1'), parse('3'), MathContext.ofScale(2, RoundingMode.Ceiling));
						expect(r.toString()).toEqual('0.34');
					});
				});

				describe('Negative values', function() {
					it('-2 / 3 to scale 2 HalfUp = -0.67', function() {
						const r = divide(parse('-2'), parse('3'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-0.67');
					});

					it('2 / -3 to scale 2 HalfUp = -0.67', function() {
						const r = divide(parse('2'), parse('-3'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-0.67');
					});

					it('-2 / -3 to scale 2 HalfUp = 0.67', function() {
						const r = divide(parse('-2'), parse('-3'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.67');
					});

					it('1 / -3 to scale 5 Down = -0.33333', function() {
						const r = divide(parse('1'), parse('-3'), MathContext.ofScale(5, RoundingMode.Down));
						expect(r.toString()).toEqual('-0.33333');
					});

					it('-1 / 3 to scale 2 Floor = -0.34', function() {
						const r = divide(parse('-1'), parse('3'), MathContext.ofScale(2, RoundingMode.Floor));
						expect(r.toString()).toEqual('-0.34');
					});

					it('-1 / 3 to scale 2 Ceiling = -0.33', function() {
						const r = divide(parse('-1'), parse('3'), MathContext.ofScale(2, RoundingMode.Ceiling));
						expect(r.toString()).toEqual('-0.33');
					});
				});

				describe('Exact results', function() {
					it('4 / 2 to scale 0 Unnecessary = 2', function() {
						const r = divide(parse('4'), parse('2'), MathContext.ofScale(0, RoundingMode.Unnecessary));
						expect(r.toString()).toEqual('2');
					});

					it('1 / 3 with Unnecessary throws', function() {
						expect(function() {
							divide(parse('1'), parse('3'), MathContext.ofScale(2, RoundingMode.Unnecessary));
						}).toThrow(MathError);
					});

					it('0 / 5 to scale 2 = 0.00', function() {
						const r = divide(parse('0'), parse('5'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.00');
					});

					it('0 / 5 without a scale = 0', function() {
						const r = divide(parse('0'), parse('5'), new MathContext(RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0');
					});

					it('division by zero throws', function() {
						expect(function() {
							divide(parse('1'), parse('0'), MathContext.ofScale(2, RoundingMode.HalfUp));
						}).toThrow(MathError);
					});
				});

				describe('Scale that is finer than the operands', function() {
					it('0.001 / 10 to scale 4 HalfUp = 0.0001', function() {
						const r = divide(parse('0.001'), parse('10'), MathContext.ofScale(4, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.0001');
					});

					it('0.001 / 10 to scale 2 HalfUp = 0.00', function() {
						const r = divide(parse('0.001'), parse('10'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.00');
					});
				});

				describe('Precision', function() {
					it('2 / 3 to precision 3 HalfUp = 0.667', function() {
						const r = divide(parse('2'), parse('3'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.667');
					});

					it('1 / 3 to precision 5 HalfUp = 0.33333', function() {
						const r = divide(parse('1'), parse('3'), MathContext.ofPrecision(5, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.33333');
					});

					it('100 / 3 to precision 4 HalfUp = 33.33', function() {
						const r = divide(parse('100'), parse('3'), MathContext.ofPrecision(4, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('33.33');
					});

					it('1 / 7 to precision 3 HalfUp = 0.143', function() {
						const r = divide(parse('1'), parse('7'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.143');
					});

					it('-1 / 7 to precision 3 HalfUp = -0.143', function() {
						const r = divide(parse('-1'), parse('7'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-0.143');
					});

					it('1 / 1 to precision 3 HalfUp = 1', function() {
						const r = divide(parse('1'), parse('1'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('1');
					});

					it('1 / 8 to precision 3 HalfUp = 0.125', function() {
						const r = divide(parse('1'), parse('8'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.125');
					});

					it('1 / 4 to precision 3 HalfUp = 0.25', function() {
						const r = divide(parse('1'), parse('4'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.25');
					});

					it('1000 / 1 to precision 2 HalfUp = 1000', function() {
						const r = divide(parse('1000'), parse('1'), MathContext.ofPrecision(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('1000');
					});
				});
			});
		}
	});
});
