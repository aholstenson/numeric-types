# Numeric types for JavaScript

This library contains implementations of useful numeric types for JavaScript
and TypeScript.

```
npm install numeric-types
```

## Status

This is currently an early release.

## API

In this library all numeric types are immutable, so functions always return a 
new instance. Each numeric type contains only a basic set of operations such
as `add`, `subtract` and `multiply`. More operations are available to import
as functions, allowing the library to take advantage of tree-shaking.

### `static NumericType.fromNumber(1.2)`

Create an instance of the numeric type from a regular JavaScript number.

### `static NumericType.fromString('1.2e10')`

Create an instance of the numeric type from a string.

### `numericType.add(other: NumericType): NumericType`

Add the given numeric type to the current one.

### `numericType.subtract(other: NumericType): NumericType`

Subtract the given number from the current one.

### `numericType.multiply(other: NumericType): NumericType`

Multiply the current number with another one.

## Type: Decimal

`Decimal` is an implementation of a numeric type that avoids the rounding
errors common with floating point numbers. There is currently a version
implemented on top of `number` available:

```javascript
import { Decimal } from 'numeric-types/decimal';

const a = Decimal.fromNumber(0.1);
const b = Decimal.fromNumber(12);

console.log(a.multiply(b).toString());
```
