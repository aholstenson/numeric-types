import { Decimal } from '../../src/decimal/Decimal.js';
import { BigDecimal } from '../../src/decimal/BigDecimal.js';
import { MathContext } from '../../src/MathContext.js';
import { MathError } from '../../src/MathError.js';
import { RoundingMode } from '../../src/RoundingMode.js';

import { scale } from '../../src/decimal/scale.js';
import { round } from '../../src/decimal/round.js';
import { add } from '../../src/decimal/add.js';
import { subtract } from '../../src/decimal/subtract.js';
import { multiply } from '../../src/decimal/multiply.js';

type Parser = (input: string) => Decimal | BigDecimal;

const implementations: [ string, Parser ][] = [
	[ 'Normal', input => Decimal.parse(input) ],
	[ 'Big', input => BigDecimal.parse(input) ]
];

/*
 * Both decimal implementations must agree, so every case runs against both.
 */
describe('Decimal', function() {
	describe('Scale', function() {
		for(const [ name, parse ] of implementations) {
			describe(name, function() {
				describe('Scale with half rounding', function() {
					it('1.051 to scale 1 HalfDown = 1.1', function() {
						const r = scale(parse('1.051'), MathContext.ofScale(1, RoundingMode.HalfDown));
						expect(r.toString()).toEqual('1.1');
					});

					it('1.049 to scale 1 HalfUp = 1.0', function() {
						const r = scale(parse('1.049'), MathContext.ofScale(1, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('1.0');
					});

					it('1.05 to scale 1 HalfDown = 1.0', function() {
						const r = scale(parse('1.05'), MathContext.ofScale(1, RoundingMode.HalfDown));
						expect(r.toString()).toEqual('1.0');
					});

					it('1.05 to scale 1 HalfUp = 1.1', function() {
						const r = scale(parse('1.05'), MathContext.ofScale(1, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('1.1');
					});

					it('1.05 to scale 1 HalfEven = 1.0', function() {
						const r = scale(parse('1.05'), MathContext.ofScale(1, RoundingMode.HalfEven));
						expect(r.toString()).toEqual('1.0');
					});

					it('1.0500 to scale 1 HalfUp = 1.1', function() {
						const r = scale(parse('1.0500'), MathContext.ofScale(1, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('1.1');
					});
				});

				describe('Scale of negative values', function() {
					it('-1.6 to scale 0 HalfUp = -2', function() {
						const r = scale(parse('-1.6'), MathContext.ofScale(0, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-2');
					});

					it('-1.5 to scale 0 HalfEven = -2', function() {
						const r = scale(parse('-1.5'), MathContext.ofScale(0, RoundingMode.HalfEven));
						expect(r.toString()).toEqual('-2');
					});

					it('-2.5 to scale 0 HalfEven = -2', function() {
						const r = scale(parse('-2.5'), MathContext.ofScale(0, RoundingMode.HalfEven));
						expect(r.toString()).toEqual('-2');
					});

					it('-1.4 to scale 0 HalfUp = -1', function() {
						const r = scale(parse('-1.4'), MathContext.ofScale(0, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-1');
					});

					it('-0.5 to scale 0 HalfUp = -1', function() {
						const r = scale(parse('-0.5'), MathContext.ofScale(0, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-1');
					});

					it('-0.4 to scale 0 Floor = -1', function() {
						const r = scale(parse('-0.4'), MathContext.ofScale(0, RoundingMode.Floor));
						expect(r.toString()).toEqual('-1');
					});

					it('-0.4 to scale 0 Ceiling = 0', function() {
						const r = scale(parse('-0.4'), MathContext.ofScale(0, RoundingMode.Ceiling));
						expect(r.toString()).toEqual('0');
					});

					it('0.4 to scale 0 Ceiling = 1', function() {
						const r = scale(parse('0.4'), MathContext.ofScale(0, RoundingMode.Ceiling));
						expect(r.toString()).toEqual('1');
					});

					it('-1.1 to scale 0 Unnecessary throws', function() {
						expect(function() {
							scale(parse('-1.1'), MathContext.ofScale(0, RoundingMode.Unnecessary));
						}).toThrow(MathError);
					});
				});

				describe('Precision', function() {
					it('123.456 to precision 4 HalfUp = 123.5', function() {
						const r = scale(parse('123.456'), MathContext.ofPrecision(4, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('123.5');
					});

					it('123.456 to precision 2 HalfUp = 120', function() {
						const r = scale(parse('123.456'), MathContext.ofPrecision(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('120');
					});

					it('123.456 to precision 6 HalfUp = 123.456', function() {
						const r = scale(parse('123.456'), MathContext.ofPrecision(6, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('123.456');
					});

					it('123.456 to precision 10 HalfUp = 123.456', function() {
						// Precision is an upper limit, so a shorter value is left alone.
						const r = scale(parse('123.456'), MathContext.ofPrecision(10, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('123.456');
					});

					it('1.005 to precision 10 Ceiling = 1.005', function() {
						const r = scale(parse('1.005'), MathContext.ofPrecision(10, RoundingMode.Ceiling));
						expect(r.toString()).toEqual('1.005');
					});

					it('0 to precision 3 HalfUp = 0', function() {
						const r = scale(parse('0'), MathContext.ofPrecision(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0');
					});

					it('9.99 to precision 2 HalfUp = 10', function() {
						const r = scale(parse('9.99'), MathContext.ofPrecision(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('10');
					});

					it('0.001234 to precision 2 HalfUp = 0.0012', function() {
						const r = scale(parse('0.001234'), MathContext.ofPrecision(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('0.0012');
					});

					it('-123.456 to precision 4 HalfUp = -123.5', function() {
						const r = scale(parse('-123.456'), MathContext.ofPrecision(4, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('-123.5');
					});

					it('precision below 1 throws', function() {
						expect(function() {
							scale(parse('1.5'), MathContext.ofPrecision(0, RoundingMode.HalfUp));
						}).toThrow(MathError);
					});
				});

				describe('Context on the math operations', function() {
					it('add applies the scale', function() {
						const r = add(parse('1.08'), parse('1.02'), MathContext.ofScale(3, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('2.100');
					});

					it('subtract applies the scale', function() {
						const r = subtract(parse('2.005'), parse('1.0'), MathContext.ofScale(2, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('1.01');
					});

					it('subtract applies the rounding mode', function() {
						const r = subtract(parse('2.005'), parse('1.0'), MathContext.ofScale(2, RoundingMode.Down));
						expect(r.toString()).toEqual('1.00');
					});

					it('subtract applies the precision', function() {
						const r = subtract(parse('123.456'), parse('0.006'), MathContext.ofPrecision(4, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('123.5');
					});

					it('multiply applies the scale', function() {
						const r = multiply(parse('1.5'), parse('1.5'), MathContext.ofScale(1, RoundingMode.HalfUp));
						expect(r.toString()).toEqual('2.3');
					});
				});

				describe('round', function() {
					it('1.5 rounds to 2 by default', function() {
						expect(round(parse('1.5')).toString()).toEqual('2');
					});

					it('-1.5 rounds to -2 by default', function() {
						expect(round(parse('-1.5')).toString()).toEqual('-2');
					});

					it('1.5 with HalfEven rounds to 2', function() {
						expect(round(parse('1.5'), RoundingMode.HalfEven).toString()).toEqual('2');
					});

					it('2.5 with HalfEven rounds to 2', function() {
						expect(round(parse('2.5'), RoundingMode.HalfEven).toString()).toEqual('2');
					});
				});
			});
		}
	});
});
