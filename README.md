# Numeric types for JavaScript

[![npm version](https://badge.fury.io/js/numeric-types.svg)](https://badge.fury.io/js/numeric-types)
[![Build Status](https://github.com/aholstenson/numeric-types/actions/workflows/ci.yml/badge.svg)](https://github.com/aholstenson/numeric-types/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/aholstenson/numeric-types/badge.svg)](https://coveralls.io/github/aholstenson/numeric-types)

This library contains implementations of useful numeric types for JavaScript
and TypeScript.

```
npm install numeric-types
```

This is an ES module package and it needs Node 20 or later. Use `import` to
load it. Node 22.12 and later can also load it with `require`.

## Features and status

This is currently an early release.

* Rounding modes: up, down, half down, half even, half up, floor, ceiling and
  unnecessary
* Scale and precision, applied through a `MathContext`
* Decimal number representation
  * `Decimal` on top of `number` with limited precision of 15 digits
  * `BigDecimal` for more precise numbers, with up to `Number.MAX_SAFE_INTEGER` digits
  * Basic math operations: add, subtract, multiply, divide, remainder and pow
* Integer representation
  * `Integer` for integers between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`
  * `BigInteger` for large integers, on top of the built-in `bigint` type
  * Math operations, and the bitwise operations over the full range of the type
* The same set of basics for both families: `abs`, `negate`, `sign`, `isZero`,
  `min` and `max`
* Conversion between the two versions of a type, and from an integer to a
  decimal
* `toNumber` and `toJSON` on every value, so a number survives
  `JSON.stringify` with all of its digits

## API

In this library all numeric types are immutable, so functions always return a 
new instance. Each numeric type provides a limited API to support their
creation and basic use.

Operations on the number types is provided as separate functions that can be 
imported. This design is to allow the library to take advantage of tree-shaking.

* `static NumericType.fromNumber(value: number): NumericType`

  Create an instance of the numeric type from a regular JavaScript number.
  The number must be finite. The integer types also require a whole number,
  and `Integer` requires one that is safe, so nothing is rounded or dropped
  without you knowing.

* `static NumericType.parse(value: string): NumericType`

  Create an instance of the numeric type from a string. Whitespace around the
  value is ignored. Anything that is not a number in the form the type accepts
  is rejected, so `parse` never returns a value that is only part of the input.
  The decimal types also accept e-notation, written with either `e` or `E`, so
  `1.5e30` and `1.5E+30` are the same value.

* `numericType.toString(): string`

  Turn the numeric type into a string representation that `parse` accepts.

  A decimal is written in the plain form, such as `120` or `0.005`, while the
  decimal point stays in the range that a `number` writes plainly, and in
  e-notation outside of it. The switch happens at the same place as it does
  for a `number`, so `1e21` is written as `1e+21` and `0.0000001` as `1e-7`.
  E-notation also keeps a large exponent from building a very long string, as
  `Decimal.parse('1e1000000')` is written with its exponent instead of a
  million zeroes. Both forms keep every digit and the scale of the value.

  ```javascript
  Decimal.parse('1.50').toString();       // '1.50'
  Decimal.parse('1e20').toString();       // '100000000000000000000'
  Decimal.parse('1e21').toString();       // '1e+21'
  Decimal.parse('1e1000000').toString();  // '1e+1000000'
  ```

* `numericType.toNumber(): number`

  Get the nearest `number` to the value. A `number` can not hold every value
  that these types can, so digits are lost when the value needs more of them
  than a `number` has, and a value that is too large becomes `Infinity`. Use
  `toString` when every digit matters.

* `numericType.toJSON(): string`

  Called by `JSON.stringify`. JSON has no exact decimal type and a large
  integer does not survive a JSON number, so the value is written as a string
  and keeps all of its digits.

  ```javascript
  JSON.stringify({ amount: Decimal.parse('0.10') }); // {"amount":"0.10"}
  ```

  Read the value back with `parse`, which accepts what `toJSON` writes.

Every type also implements `Symbol.toPrimitive`, so a value converts when
JavaScript needs a primitive. `Number(value)` and a comparison such as
`a < b` use the number form, and everything else uses the string form. `+` is
therefore a string join and not math:

```javascript
`${Decimal.parse('1.50')}`     // '1.50'
Number(Decimal.parse('1.50'))  // 1.5
'' + Decimal.parse('1.50')     // '1.50'
```

Use the operations below for math, as they keep every digit.

### Conversion between types

Each type can be built from the other version of itself, and the decimal types
can also be built from an integer.

* `static BigDecimal.fromDecimal(value: Decimal): BigDecimal`
* `static Decimal.fromBigDecimal(value: BigDecimal): Decimal`
* `static BigInteger.fromInteger(value: Integer): BigInteger`
* `static Integer.fromBigInteger(value: BigInteger): Integer`
* `static Decimal.fromInteger(value: Integer): Decimal`
* `static BigDecimal.fromBigInteger(value: BigInteger): BigDecimal`

A conversion keeps the scale of the number, so `1.50` stays `1.50`. Going to a
big type always works. Going the other way throws a `MathError` when the value
needs more digits than the smaller type holds, so nothing is dropped without
you knowing.

```javascript
import { Decimal, BigDecimal } from 'numeric-types/decimal';

const big = BigDecimal.fromDecimal(Decimal.parse('1.50'));
const back = Decimal.fromBigDecimal(big);
```

The big types also read the built-in `bigint` type:

* `static BigInteger.fromBigInt(value: bigint): BigInteger`
* `static BigDecimal.fromBigInt(value: bigint): BigDecimal`

### Errors

Every failure is reported as a `MathError`, which is exported from
`numeric-types`. This includes input that can not be parsed, a value that does
not fit the type, a division by zero, and an operation that mixes two
different types.

```javascript
import { MathError } from 'numeric-types';
import { Decimal } from 'numeric-types/decimal';

try {
	Decimal.parse('not a number');
} catch(ex) {
	if(ex instanceof MathError) {
		// Handle the invalid input
	}
}
```

## `MathContext` and rounding

This library uses a class named `MathContext` to support operations such as
setting the scale or precision and rounding a number.

```javascript
import { MathContext, RoundingMode } from 'numeric-types';

// Create a context that requests 2 digits after the decimal using Half Up rounding
const contextWithScale = MathContext.ofScale(2, RoundingMode.HalfUp);

// Context that requests at max 10 digits of precision
const contextWithPrecision = MathContext.ofPrecision(10, RoundingMode.Ceiling);
```

Scale is the number of digits after the decimal point, so a scale of 2 turns
`1.005` into `1.01`. Precision is the number of significant digits, so a
precision of 2 turns `123.456` into `120` and `0.001234` into `0.0012`. A
precision must be at least 1.

A context can carry only one of the two. If you build a context with the
constructor and set both, the scale is used and the precision is ignored.

### Rounding modes

* `RoundingMode.Down` - Round towards zero.
* `RoundingMode.Up` - Round away from zero.
* `RoundingMode.HalfDown` - Round towards the nearest neighbor, but if in the middle round towards zero.
* `RoundingMode.HalfEven` - Round towards the nearest neighbor, but if in the middle round towards the even neighbor.
* `RoundingMode.HalfUp` - Round towards the nearest neighbor, but if in the middle round away from zero.
* `RoundingMode.Floor` - Round towards negative infinity.
* `RoundingMode.Ceiling` - Round towards positive infinity.
* `RoundingMode.Unnecessary` - Do not round, instead throw an error if rounding is required.

## Type: Decimal

Decimal is an implementation of a numeric type that avoids the rounding
errors common with floating point numbers. There are two versions, `Decimal`
and `BigDecimal` where `Decimal` is limited to safely handling 15 digits and
`BigDecimal` can handle up to `Number.MAX_SAFE_INTEGER` digits:

```javascript
import { Decimal, multiply } from 'numeric-types/decimal';

const a = Decimal.fromNumber(0.1);
const b = Decimal.parse('12');

const ab = multiply(a, b);
console.log(ab.toString());
```

Types are available for TypeScript:

```typescript
import { AbstractDecimal, Decimal } from 'numeric-types/decimal';

const decimal: AbstractDecimal<any> = Decimal.fromNumber(0.1);
```

`Decimal` throws a `MathError` when a result needs more digits than a `number`
can hold exactly. It reports the limit instead of dropping digits, so a result
you receive is always exact. Use `BigDecimal` for values that need more room.

The two types can not be mixed in one operation. An operation that receives a
`Decimal` and a `BigDecimal` throws a `MathError`.

### Constants

Both types carry the common values as static constants. They have no digits
after the decimal point, and they are shared instances, so reading one costs
nothing:

```javascript
import { Decimal, add } from 'numeric-types/decimal';

const total = add(Decimal.parse('1.25'), Decimal.ONE);
```

| Constant | Value |
|----------|-------|
| `ZERO` | `0` |
| `ONE` | `1` |
| `MINUS_ONE` | `-1` |
| `TWO` | `2` |
| `TEN` | `10` |

A constant belongs to its own type, so use `Decimal.ONE` with a `Decimal` and
`BigDecimal.ONE` with a `BigDecimal`.

### Operations

These operations are available from `numeric-types/decimal`. Import them
separately like:

```javascript
import { operationHere, anotherOperation } from 'numeric-types/decimal';
```

* `compare(a: DecimalType, b: DecimalType): -1 | 0 | 1`

  Compare two decimal numbers. This method will return `0` if the numbers are
  the same, `-1` if `a` is less than `b` and `1` if `a` is greater than `b`.

* `isEqual(a: DecimalType, b: DecimalType): boolean`

  Get if two decimal numbers are equal.

* `isLessThan(a: DecimalType, b: DecimalType): boolean`

  Get if the decimal number `a` is less than the number `b`.

* `isLessThanOrEqual(a: DecimalType, b: DecimalType): boolean`

  Get if the decimal number `a` is less than or equal to the number `b`.

* `isGreaterThan(a: DecimalType, b: DecimalType): boolean`

  Get if the decimal number `a` is greater than the number `b`.

* `isGreaterThanOrEqual(a: DecimalType, b: DecimalType): boolean`

  Get if the decimal number `a` is greater than or equal to the number `b`.

* `min(a: DecimalType, b: DecimalType): DecimalType`

  Get the smaller of two decimal numbers. Two numbers can be equal and still
  be written with a different scale, and `a` is returned in that case.

* `max(a: DecimalType, b: DecimalType): DecimalType`

  Get the larger of two decimal numbers. Two numbers can be equal and still be
  written with a different scale, and `a` is returned in that case.

* `isZero(a: DecimalType): boolean`

  Get if a decimal number is zero. The scale does not matter, so `0`, `0.0`
  and `0e10` are all zero.

* `sign(a: DecimalType): -1 | 0 | 1`

  Get the sign of a decimal number. Returns `-1` for a negative number, `0`
  for zero and `1` for a positive number.

* `toString(a: DecimalType): string`

  Turn a decimal numbers into its string representation, either in the plain
  form or in e-notation. See `numericType.toString()` above for the form that
  is used.

* `toNumber(a: DecimalType): number`

  Get the nearest `number` to a decimal number.

* `scale(a: DecimalType, context: MathContext): DecimalType`

  Scale the given decimal number according to the specified context. The
  context can request a scale or a precision.

* `round(a: DecimalType, roundingMode?: RoundingMode): DecimalType`

  Round the given decimal number to a whole number. If the rounding mode is
  not specified `RoundingMode.HalfUp` is used. This is equivalent to calling
  `scale` with `MathContext.ofScale(0, roundingMode)`.

* `abs(a: DecimalType): DecimalType`

  Get the absolute value of a decimal number. The scale is kept, so `-1.50`
  becomes `1.50`.

* `negate(a: DecimalType): DecimalType`

  Get a decimal number with its sign flipped. The scale is kept, so `1.50`
  becomes `-1.50`.

* `add(a: DecimalType, b: DecimalType, context?: MathContext): DecimalType`

  Add two decimal numbers together, optionally specifying a context to be used
  to adjust the scale of the result.

* `subtract(a: DecimalType, b: DecimalType, context?: MathContext): DecimalType`
  
  Subtract a decimal number `b` from the number `a`. Optionally specify a
  context to be used to adjust the scale of the result.

* `multiply(a: DecimalType, b: DecimalType, context?: MathContext): DecimalType`

  Multiply two decimal numbers together. Optionally specify a context to be
  used to adjust the scale of the result.

* `divide(a: DecimalType, b: DecimalType, context: MathContext): DecimalType`

  Divide the number `a` by the divisor `b`. A context is required, as a
  division rarely has an exact result and the context decides how many digits
  are kept and how they are rounded.

  A context that carries neither a scale nor a precision keeps 5 digits after
  the decimal point and then removes trailing zeroes. A divisor of zero throws
  a `MathError`.

* `remainder(a: DecimalType, b: DecimalType, context?: MathContext): DecimalType`

  Get what remains after `a` is divided by `b`. The division truncates towards
  zero, so the remainder carries the sign of `a` and `10.5` divided by `3`
  leaves `1.5`. The result is exact. A divisor of zero throws a `MathError`.

* `pow(a: DecimalType, exponent: number, context?: MathContext): DecimalType`

  Raise `a` to a whole power given as a regular number. A power of zero or
  more is exact, and every number raised to zero is `1`.

  A negative power is a division, so it needs a context that says how many
  digits to keep. Without one it throws a `MathError`, and so does `0` raised
  to a negative power.

Without a context, `add`, `subtract`, `multiply`, `remainder` and `pow` are
exact, and trailing zeroes are removed from the result. `0.50 + 0.50` is
therefore `1` and not `1.00`. Pass a context when the result has to keep a
specific shape.

## Type: Integer

Integer is an implementation of a whole number. There are currently two versions
available, `Integer` which is limited to the range of `number` and `BigInteger`
which uses the built-in `bigint` type to represent larger numbers.

```javascript
import { Integer, multiply } from 'numeric-types/integer';

const a = Integer.fromNumber(20);
const b = Integer.parse('40');

const ab = multiply(a, b);
console.log(ab.toString());
```

Types are available for TypeScript:

```typescript
import { AbstractInteger, Integer } from 'numeric-types/integer';

const integer: AbstractInteger<any> = Integer.fromNumber(1);
```

Both types accept only whole numbers. `Integer.fromNumber(1.5)` throws a
`MathError` instead of rounding, and `Integer` also rejects a value outside
the safe range of `number`. Use `BigInteger` for values that are larger.

The two types can not be mixed in one operation. An operation that receives an
`Integer` and a `BigInteger` throws a `MathError`.

### Constants

Both types carry the common values as static constants. They are shared
instances, so reading one costs nothing:

```javascript
import { Integer, add } from 'numeric-types/integer';

const next = add(Integer.parse('41'), Integer.ONE);
```

| Constant | Value |
|----------|-------|
| `ZERO` | `0` |
| `ONE` | `1` |
| `MINUS_ONE` | `-1` |
| `TWO` | `2` |
| `TEN` | `10` |

A constant belongs to its own type, so use `Integer.ONE` with an `Integer` and
`BigInteger.ONE` with a `BigInteger`.

### Operations

These operations are available from `numeric-types/integer`. Import them
separately like:

```javascript
import { operationHere, anotherOperation } from 'numeric-types/integer';
```

* `compare(a: IntegerType, b: IntegerType): -1 | 0 | 1`

  Compare two integers. This method will return `0` if the numbers are
  the same, `-1` if `a` is less than `b` and `1` if `a` is greater than `b`.

* `isEqual(a: IntegerType, b: IntegerType): boolean`

  Get if two integers are equal.

* `isLessThan(a: IntegerType, b: IntegerType): boolean`

  Get if the integer `a` is less than the number `b`.

* `isLessThanOrEqual(a: IntegerType, b: IntegerType): boolean`

  Get if the integer `a` is less than or equal to the number `b`.

* `isGreaterThan(a: IntegerType, b: IntegerType): boolean`

  Get if the integer `a` is greater than the number `b`.

* `isGreaterThanOrEqual(a: IntegerType, b: IntegerType): boolean`

  Get if the integer `a` is greater than or equal to the number `b`.

* `min(a: IntegerType, b: IntegerType): IntegerType`

  Get the smaller of two integers. `a` is returned when they are equal.

* `max(a: IntegerType, b: IntegerType): IntegerType`

  Get the larger of two integers. `a` is returned when they are equal.

* `isZero(a: IntegerType): boolean`

  Get if an integer is zero.

* `sign(a: IntegerType): -1 | 0 | 1`

  Get the sign of an integer. Returns `-1` for a negative number, `0` for zero
  and `1` for a positive number.

* `toString(a: IntegerType): string`

  Turn a integers into its string representation.

* `toNumber(a: IntegerType): number`

  Get the nearest `number` to an integer.

* `add(a: IntegerType, b: IntegerType): IntegerType`

  Add two integers together.

* `subtract(a: IntegerType, b: IntegerType): IntegerType`

  Subtract `b` from `a`.

* `multiply(a: IntegerType, b: IntegerType): IntegerType`

  Multiply two integers together.

* `divide(a: IntegerType, b: IntegerType): IntegerType`

  Divide `a` by the divisor `b`. The result is truncated towards zero, so
  `-7 / 2` is `-3`. A divisor of zero throws a `MathError`.

* `remainder(a: IntegerType, b: IntegerType): IntegerType`

  Get what remains after `a` is divided by `b`. The remainder carries the sign
  of `a`, so `-7 % 2` is `-1`. Together with `divide` this holds:
  `divide(a, b) * b + remainder(a, b) === a`. A divisor of zero throws a
  `MathError`.

* `exponentiate(a: IntegerType, b: IntegerType): IntegerType`

  Raise `a` to the power of `b`. The exponent must not be negative, as a
  negative exponent describes a fraction.

* `pow(a: IntegerType, exponent: number): IntegerType`

  Raise `a` to a whole power given as a regular number. This is
  `exponentiate` with an exponent that does not have to be built as an integer
  first. The exponent must not be negative.

* `abs(a: IntegerType): IntegerType`

  Get the absolute value of the integer.

* `negate(a: IntegerType): IntegerType`

  Get the integer with its sign flipped.

* `unaryMinus(a: IntegerType): IntegerType`

  Another name for `negate`, which the decimal types use as well.

### Bitwise operations

These work over the whole range of the type, and not only over the 32 bits
that the JavaScript operators use. A result that no longer fits the type
throws a `MathError`.

* `bitwiseAnd(a: IntegerType, b: IntegerType): IntegerType`

  Combine two integers with a bitwise and.

* `bitwiseOr(a: IntegerType, b: IntegerType): IntegerType`

  Combine two integers with a bitwise or.

* `bitwiseNot(a: IntegerType): IntegerType`

  Invert every bit of the integer.

* `leftShift(a: IntegerType, amount: number): IntegerType`

  Shift the integer to the left by the given number of bits.

* `signedRightShift(a: IntegerType, amount: number): IntegerType`

  Shift the integer to the right by the given number of bits, keeping its
  sign.
