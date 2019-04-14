# Numeric types for JavaScript

[![npm version](https://badge.fury.io/js/numeric-types.svg)](https://badge.fury.io/js/numeric-types)
[![Build Status](https://travis-ci.org/aholstenson/numeric-types.svg?branch=master)](https://travis-ci.org/aholstenson/numeric-types)
[![Coverage Status](https://coveralls.io/repos/aholstenson/numeric-types/badge.svg)](https://coveralls.io/github/aholstenson/numeric-types)
[![Dependencies](https://david-dm.org/aholstenson/numeric-types.svg)](https://david-dm.org/aholstenson/numeric-types)

This library contains implementations of useful numeric types for JavaScript
and TypeScript.

```
npm install numeric-types
```

## Status

This is currently an early release.

## API

In this library all numeric types are immutable, so functions always return a 
new instance. Each numeric type provides a limited API to support their
creation and basic use. Operations on the number types is provided as separate
functions that can be imported. This design is to allow the library to take
advantage of tree-shaking.

### `static NumericType.fromNumber(1.2): NumericType`

Create an instance of the numeric type from a regular JavaScript number.

### `static NumericType.fromString('1.2e10'): NumericType`

Create an instance of the numeric type from a string.

### `numericType.toString()`

Turn the numeric type into a string representation supported by `fromString`.

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

`Decimal` is an implementation of a numeric type that avoids the rounding
errors common with floating point numbers. There is currently a version
implemented on top of `number` available:

```javascript
import { Decimal, multiply } from 'numeric-types/decimal';

const a = Decimal.fromNumber(0.1);
const b = Decimal.fromString(12);

const ab = multiply(a, b);
console.log(ab.toString());
```

### Operations

These operations are available from `numeric-types/decimal`. Import them
separately like:

```javascript
import { operationHere, anotherOperation } from 'numeric-types/decimal';

const { operationHere, anotherOperation } = require('numeric-types/decimal');
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

  Scale the given decimal number according to the specified context.

* `round(a: DecimalType, roundingMode?: RoundingMode): DecimalType`

  Round the given decimal number. If the rounding mode is not specified
  `RoundingMode.HalfUp` is used. This is equivalent to calling `scale` with
  `MathContext.ofScale(0, roundingMode)`.

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

  Divide a decimal number `b` from the number `a`. A context is required to
  determine the scale and how to round things.

