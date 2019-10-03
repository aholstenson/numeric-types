import {
	Integer,
	add,
	subtract,
	multiply,
	divide,
	exponentiate,
	bitwiseNot,
	unaryMinus,
	leftShift,
	signedRightShift
} from '../../src/integer';

describe('Integer', function() {
	describe('Normal', function() {
		describe('add', function() {
			it('1 + 1 = 2', function() {
				const a = Integer.fromNumber(1);
				const b = Integer.fromNumber(1);
				const r = add(a, b);
				expect(r.toString()).toEqual('2');
			});
		});

		describe('subtract', function() {
			it('1 - 1 = 0', function() {
				const a = Integer.fromNumber(1);
				const b = Integer.fromNumber(1);
				const r = subtract(a, b);
				expect(r.toString()).toEqual('0');
			});
		});

		describe('multiply', function() {
			it('2 * 4 = 8', function() {
				const a = Integer.fromNumber(2);
				const b = Integer.fromNumber(4);
				const r = multiply(a, b);
				expect(r.toString()).toEqual('8');
			});
		});

		describe('divide', function() {
			it('4 / 2 = 2', function() {
				const a = Integer.fromNumber(4);
				const b = Integer.fromNumber(2);
				const r = divide(a, b);
				expect(r.toString()).toEqual('2');
			});
		});

		describe('exponentiate', function() {
			it('4 ** 2 = 2', function() {
				const a = Integer.fromNumber(4);
				const b = Integer.fromNumber(2);
				const r = exponentiate(a, b);
				expect(r.toString()).toEqual('16');
			});
		});

		describe('unaryMinus', function() {
			it('-5', function() {
				const a = Integer.fromNumber(5);
				const r = unaryMinus(a);
				expect(r.toString()).toEqual('-5');
			});
		});

		describe('bitwiseNot', function() {
			it('~4', function() {
				const a = Integer.fromNumber(4);
				const r = bitwiseNot(a);
				expect(r.toString()).toEqual('-5');
			});
		});

		describe('leftShift', function() {
			it('4 << 1', function() {
				const a = Integer.fromNumber(4);
				const r = leftShift(a, 1);
				expect(r.toString()).toEqual('8');
			});
		});

		describe('signedRightShift', function() {
			it('4 >> 1', function() {
				const a = Integer.fromNumber(4);
				const r = signedRightShift(a, 1);
				expect(r.toString()).toEqual('2');
			});
		});
	});
});
