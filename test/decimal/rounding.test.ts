import { Decimal } from '../../src/decimal/decimal-normal';
import { RoundingMode } from '../../src/rounding-mode';
import { round } from '../../src/decimal/ops/rounding';
import { SPI } from '../../src/decimal/ops/symbols';

function doRound(mode: RoundingMode, c: number, q: number): number {
	const spi = Decimal[SPI];
	return round(spi, mode, Math.floor(c / q), Math.floor(c % q));
}

describe('Decimal', function() {
	describe('Rounding', function() {
		describe('Down', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.Down, 55, 10)
				).toEqual(5);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.Down, 36, 10)
				).toEqual(3);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.Down, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.Down, 11, 10)
				).toEqual(1);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.Down, -11, 10)
				).toEqual(-1);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.Down, -20, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.Down, -36, 10)
				).toEqual(-3);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.Down, -55, 10)
				).toEqual(-5);
			});
		});

		describe('Up', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.Up, 55, 10)
				).toEqual(6);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.Up, 36, 10)
				).toEqual(4);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.Up, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.Up, 11, 10)
				).toEqual(2);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.Up, -11, 10)
				).toEqual(-2);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.Up, -20, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.Up, -36, 10)
				).toEqual(-4);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.Up, -55, 10)
				).toEqual(-6);
			});
		});

		describe('Floor', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.Floor, 55, 10)
				).toEqual(5);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.Floor, 36, 10)
				).toEqual(3);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.Floor, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.Floor, 11, 10)
				).toEqual(1);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.Floor, -11, 10)
				).toEqual(-2);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.Floor, -20, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.Floor, -36, 10)
				).toEqual(-4);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.Floor, -55, 10)
				).toEqual(-6);
			});
		});

		describe('Ceiling', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.Ceiling, 55, 10)
				).toEqual(6);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.Ceiling, 36, 10)
				).toEqual(4);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.Ceiling, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.Ceiling, 11, 10)
				).toEqual(2);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.Ceiling, -11, 10)
				).toEqual(-1);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.Ceiling, -20, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.Ceiling, -36, 10)
				).toEqual(-3);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.Ceiling, -55, 10)
				).toEqual(-5);
			});
		});

		describe('HalfDown', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.HalfDown, 55, 10)
				).toEqual(5);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.HalfDown, 36, 10)
				).toEqual(4);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.HalfDown, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.HalfDown, 11, 10)
				).toEqual(1);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.HalfDown, -11, 10)
				).toEqual(-1);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.HalfDown, -20, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.HalfDown, -36, 10)
				).toEqual(-4);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.HalfDown, -55, 10)
				).toEqual(-5);
			});
		});

		describe('HalfUp', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.HalfUp, 55, 10)
				).toEqual(6);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.HalfUp, 36, 10)
				).toEqual(4);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.HalfUp, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.HalfUp, 11, 10)
				).toEqual(1);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.HalfUp, -11, 10)
				).toEqual(-1);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.HalfUp, -20, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.HalfUp, -36, 10)
				).toEqual(-4);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.HalfUp, -55, 10)
				).toEqual(-6);
			});
		});

		describe('HalfEven', function() {
			it('5.5', function() {
				expect(
					doRound(RoundingMode.HalfEven, 55, 10)
				).toEqual(6);
			});

			it('3.6', function() {
				expect(
					doRound(RoundingMode.HalfEven, 36, 10)
				).toEqual(4);
			});

			it('2.5', function() {
				expect(
					doRound(RoundingMode.HalfEven, 25, 10)
				).toEqual(2);
			});

			it('2.0', function() {
				expect(
					doRound(RoundingMode.HalfEven, 20, 10)
				).toEqual(2);
			});

			it('1.1', function() {
				expect(
					doRound(RoundingMode.HalfEven, 11, 10)
				).toEqual(1);
			});

			it('-1.1', function() {
				expect(
					doRound(RoundingMode.HalfEven, -11, 10)
				).toEqual(-1);
			});

			it('-2.0', function() {
				expect(
					doRound(RoundingMode.HalfEven, -20, 10)
				).toEqual(-2);
			});

			it('-2.5', function() {
				expect(
					doRound(RoundingMode.HalfEven, -25, 10)
				).toEqual(-2);
			});

			it('-3.6', function() {
				expect(
					doRound(RoundingMode.HalfEven, -36, 10)
				).toEqual(-4);
			});

			it('-5.5', function() {
				expect(
					doRound(RoundingMode.HalfEven, -55, 10)
				).toEqual(-6);
			});
		});
	});
});
