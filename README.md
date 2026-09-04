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
  * Basic math operations: add, subtract, multiply, divide
* Integer representation
  * `Integer` for integers between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`
  * `BigInteger` for large integers, on top of the built-in `bigint` type
  * Math operations, and the bitwise operations over the full range of the type

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

* `numericType.toString(): string`

  Turn the numeric type into a string representation that `parse` accepts.

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

* `toString(a: DecimalType): string`

  Turn a decimal numbers into its string representation.

* `scale(a: DecimalType, context: MathContext): DecimalType`

  Scale the given decimal number according to the specified context. The
  context can request a scale or a precision.

* `round(a: DecimalType, roundingMode?: RoundingMode): DecimalType`

  Round the given decimal number to a whole number. If the rounding mode is
  not specified `RoundingMode.HalfUp` is used. This is equivalent to calling
  `scale` with `MathContext.ofScale(0, roundingMode)`.

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

Without a context, `add`, `subtract` and `multiply` are exact, and trailing
zeroes are removed from the result. `0.50 + 0.50` is therefore `1` and not
`1.00`. Pass a context when the result has to keep a specific shape.

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

* `toString(a: IntegerType): string`

  Turn a integers into its string representation.

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

* `unaryMinus(a: IntegerType): IntegerType`

  Get the negated integer.

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
