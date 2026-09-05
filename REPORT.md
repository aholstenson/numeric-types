# Code review: numeric-types

Point-in-time review of the library.

| | |
| --- | --- |
| Date | 2026-09-04 |
| Commit | `d0c3ebe` |
| Branch | `feature/esm-and-modernization` |
| Node | v26.7.0 |
| Test suite at review time | 140 tests, all passing |
| Test suite after the fixes | 290 tests, all passing |

Every defect below was reproduced by running the code. The defects are not
theoretical. The test suite passed with all of them present, so the suite was
part of the problem and not a safety net.

All file and line references point at the reviewed commit.

## Summary

The architecture is good. The arithmetic was not.

* 1 defect made the process hang forever.
* 5 defects gave wrong numeric results.
* 8 design problems made the two implementations of a type disagree with each
  other, or made the API unsafe.
* 4 statements in the README did not agree with the code.

## Status

The six critical defects are fixed. So are the 32-bit limit on the integer
bitwise operations, the integer division semantics, the missing operand
checks, the inconsistent error types, the permissive `Integer.parse` and the
README.

Three further defects were found while the fixes were written, and all three
are fixed as well:

* `Decimal` silently dropped a digit when a product passed
  `Number.MAX_SAFE_INTEGER`. The check for a safe result ran only on the
  coefficient that reached the constructor, and the lost digit became a
  trailing zero that the reduction step then removed.
  `99999999 * 99999999` returned `9999999800000000` instead of an error.
* `divide` ignored the requested scale when the dividend was zero.
  `0 / 5` at a scale of two returned `0` instead of `0.00`.
* Precision padded a value up to the requested digit count instead of treating
  it as an upper limit. A precision of ten turned `1.005` into `1.005000000`,
  which claims nine digits of accuracy that the value does not have.

Every item that this review raised is now closed. The module-scoped symbols,
the `sideEffects` flag and the two `@ts-ignore` suppressions were closed by the
restructuring that merged the two service provider interfaces into one shared
arithmetic.

### Changes that callers can notice

* `MathError` is now the only error type that the library throws. Parse and
  conversion failures used to throw a plain `Error`.
* `Integer.fromNumber` rejects a fraction instead of rounding it down.
  `Integer.fromNumber(1.5)` used to return `1`, and `-1.5` used to return
  `-2`. `BigInteger` has always rejected a fraction, so the two types now
  agree.
* `Integer.parse` and `BigInteger.parse` accept only a whole number, with
  optional whitespace around it. `Integer.parse('12abc')` used to return `12`
  and `BigInteger.parse('')` used to return `0`.
* `Integer.parse` reports a value that is too large for the safe range instead
  of silently dropping its last digits.
* Integer division and remainder throw on a divisor of zero, and
  `exponentiate` throws on a negative exponent. These used to produce an
  engine error, or a wrong result.
* Mixing an `Integer` with a `BigInteger`, or a `Decimal` with a
  `BigDecimal`, throws a `MathError` that names the problem.

### Changes to the SPI

The service provider interfaces changed, so code outside this package that
implements one has to be updated.

* `DecimalSPI.firstDigit` is replaced by `DecimalSPI.digits`, because the
  first digit of a remainder can not tell `0.05` from `0.051`.
* `DecimalSPI.divide` and `IntegerSPI.divide` must truncate towards zero.
* `IntegerSPI` gained `isZero` and `isNegative`.

## Strengths

* **Clean layering.** `AbstractDecimal` plus `DecimalSPI` lets `Decimal` (on
  `number`) and `BigDecimal` (on `bigint`) share all algorithms. This is the
  correct shape for the problem.
* **Correct value model.** Decimals are a coefficient and a base-10 exponent.
  This avoids binary floating-point error, in the same way as Java
  `BigDecimal`.
* **Immutable values with free functions.** Operations are separate modules.
  This helps tree-shaking and makes the values easy to reason about.
* **Internals are hidden with symbols.** `COEFFICIENT`, `EXPONENT` and `VALUE`
  keep the public surface small.
* **The build is modern and complete.** ESM, `nodenext` resolution, strict
  TypeScript, per-path `exports`, a Node 20/22/24 matrix in CI, and coverage
  upload.
* **All eight rounding modes exist**, and `test/decimal/rounding.test.ts`
  covers the rounding function itself well.

## Critical defects

### 1. Infinite loop that hangs the process

**Fixed.** The loop now divides the running value. The shared helper is
`reduce` in `src/decimal/ops/rescalingOp.ts`.

`src/decimal/ops/rescalingOp.ts:39`

The reduction loop divides the original coefficient on each pass instead of the
running value:

```ts
scaledCoefficient = spi.divide(coefficient, spi.TEN);   // must be scaledCoefficient
```

The running value stops changing, so the loop condition stays true forever.

Any result with two or more trailing zeros hangs. Examples that never return:

```ts
add(Decimal.parse('0.50'), Decimal.parse('0.50'));
multiply(Decimal.parse('99999999'), Decimal.parse('99999999'));
```

A caller cannot recover from this. A timeout does not help, because the loop is
synchronous. Treat it as a denial of service.

### 2. `isGreaterThan` is always false for `Integer`

**Fixed.** `Integer` now compares in the same way as `BigInteger`.

`src/integer/Integer.ts:82`

```ts
compare(a, b) { return a < b ? -1 : (a === b ? 0 : -1); }   // the last -1 must be 1
```

`compare(5, 3)` returns `-1`. `isGreaterThan`, `isGreaterThanOrEqual` and any
sort built on `compare` give wrong answers. `BigInteger` is correct, so the two
integer types disagree.

No test covers `compare` for integers.

### 3. Division rounds with the wrong remainder

**Fixed.** `divideOp` now sets up one division and one rounding step, and
reads the remainder of that division.

`src/decimal/ops/divideOp.ts:32`

The remainder is read after the coefficient is replaced by the quotient:

```ts
coefficient = spi.divide(coefficient, b[COEFFICIENT]);
const remainder = spi.remainder(coefficient, b[COEFFICIENT]);  // reads the quotient
```

Measured results:

| Operation | Result | Correct |
| --- | --- | --- |
| `2 / 3`, scale 2, HalfUp | `0.66` | `0.67` |
| `1 / 8`, scale 2, HalfUp | `0.12` | `0.13` |

All existing division tests use `RoundingMode.Down`. That mode ignores the
remainder for positive values, so the tests hide the defect.

### 4. Half-rounding treats "starts with 5" as "exactly half"

**Fixed.** `round` now compares twice the remainder against the divisor, so it
needs the divisor as an argument. `firstDigit` is gone from the SPI.

`src/decimal/ops/round.ts:58`

The code decides the half cases from `spi.firstDigit(remainder)`. The first
digit cannot tell `0.05` from `0.051`.

Measured: `1.051` rescaled to scale 1 with `HalfDown` gives `1.0`. The correct
result is `1.1`, because `0.051` is more than half of `0.1`.

The rounding tests only supply exact halves, so they pass.

The fix is to compare the remainder against half of the divisor. That removes
the need for `firstDigit` in the SPI.

### 5. `BigDecimal` rounds negative numbers the wrong way

**Fixed.** Rounding no longer reads digits from a string, and it takes the sign
from the fraction rather than from the quotient, which is zero for every value
between -1 and 1.

`src/decimal/BigDecimal.ts:66`

```ts
firstDigit(a) { return parseInt(a.toString()[0], 10); }
```

For a negative value the first character is `-`, so the result is `NaN`. Both
comparisons against `5` then fail, and the code falls into the "exactly half"
branch.

Measured: `BigDecimal` `-1.6` to scale 0 with `HalfUp` gives `-1`. `Decimal`
gives `-2`. The two implementations of the same type disagree.

The `Decimal` version is safe only because it calls `Math.abs` first.

### 6. `MathContext.ofPrecision` has no effect

**Fixed.** Both fields now default to `undefined`, and precision is
implemented for `scale`, `round` and `divide`. A precision below 1 throws a
`MathError`.

`src/MathContext.ts:23` and `src/MathContext.ts:27`

`ofScale` sets `precision` to `0`, and `ofPrecision` sets `scale` to `0`.
`calculateExponent` tests `scale` first, so a context from `ofPrecision` is
always read as "scale 0" and the precision is discarded.

Measured: precision 4 applied to `123.456` gives `123`, not `123.5`.

A hand-built context that sets only `precision` reaches
`src/decimal/ops/rescalingOp.ts:76` and throws `No support for precision`.

Both fields must default to `undefined`. Precision must then be implemented, or
removed from the public API and the README.

## Design problems

* **Fixed: `Integer` bitwise operations were 32-bit.** `<<`, `>>`, `&`, `|` and `~` on
  a `number` coerce the operand to a signed 32-bit integer. `(2**40) << 1` is
  `0`. The type promises the full safe-integer range, so these operations are
  silently wrong above 2^31. They now compute through `BigInt`, and
  `newInstance` rejects a result that no longer fits the safe range.
  (`src/integer/Integer.ts:61`-`79`)
* **Fixed: integer division disagreed between the two types.** `Integer`
  computed `-7 / 2` as `-4`, because it divided as a float and then applied
  `Math.floor`. `BigInteger` computed `-3`, because `bigint` truncates. Both
  now truncate towards zero.
  (`src/integer/Integer.ts:25`, `src/integer/Integer.ts:45`)
* **Fixed: integer operations did not check their operand types.** The
  `decimal` package has `validateCompatible`. The `integer` package had no
  equivalent, so mixing `Integer` and `BigInteger` produced a raw engine
  error: `TypeError: Cannot mix BigInt and other types`. Every binary
  integer operation now checks its operands.
* **Fixed: errors were inconsistent.** Parse and conversion failures threw a
  plain `Error`, while range failures threw `MathError`. Every failure is now
  a `MathError`.
* **Fixed: `Integer.parse` accepted invalid input.** It used `parseInt`, so
  `'12abc'` became `12` and `'1.2.3'` became `1`. Both integer types now share
  one check, and reject anything that is not a whole number.
* **Fixed: module-scoped symbols broke duplicate installs.** `Symbol('SPI')` is
  unique to each copy of the module, so two versions of the package in one
  dependency tree created values that could not be used together. Every symbol
  now comes from `Symbol.for`.
* **Fixed: `sideEffects: false` did not agree with the SPI assignment.** The
  SPI was attached by a top-level assignment, such as `Decimal[SPI] = { ... }`.
  Each type now returns its SPI from a getter that reads a module constant, so
  no module writes to an imported binding.
* **Fixed: `@ts-ignore` in both base classes.** They suppressed the type error
  on `this.constructor[SPI]`. The lookup is now an abstract accessor that each
  type implements, and the library has no suppressions left.

## Test gaps

The defects above survived because of these gaps. Every gap in this list is now
closed, and the suite has grown from 140 tests to 290.

* No tests for integer `compare`, `remainder`, `bitwiseAnd` or `bitwiseOr`.
  Covered by `test/integer/compare.test.ts` and `test/integer/bitwise.test.ts`.
* No tests for the public `scale` and `round` functions. Only the internal
  rounding helper was tested. Covered by `test/decimal/scale.test.ts`.
* No division test with any half-rounding mode. Covered by
  `test/decimal/division.test.ts`.
* No rounding test for negative values on `BigDecimal`. Every case in the new
  decimal suites runs against both implementations.
* No test that gives the same input to `Decimal` and `BigDecimal` and compares
  the two results. Covered by `test/decimal/differential.test.ts`.
* No property-based tests. `test/decimal/differential.test.ts` checks 2000
  generated cases per operation against a reference built on exact `bigint`
  rational arithmetic. The reference selects a neighbor by measuring the
  distance to each one, while the library truncates and inspects the
  remainder, so the two routes stay independent. The generator uses a fixed
  seed, so a failure can be repeated.
* No tests for how the library reports bad input. Covered by
  `test/decimal/errors.test.ts` and `test/integer/errors.test.ts`.

## Documentation defects

All of these are fixed. Where the code was the better thing to change, the
code changed instead of the text.

* The README documents `subtract(a, b, context?)`. The code was
  `subtract(a, b)`, with no context parameter, although `subtractOp` already
  accepted one. `subtract` now takes the context, so `add`, `subtract` and
  `multiply` are consistent.
  (`src/decimal/subtract.ts:7`)
* The README said the string form is "supported by `fromString`". The method is
  named `parse`.
* The README documents `MathContext.ofPrecision`. Precision is now
  implemented.
* `test/decimal/normal.test.ts:41` was titled `1e2 + 1e4 = 10101` but asserts
  `10100`. The assertion is correct, so the title changed. Five more titles in
  the decimal and integer suites had the same problem.

The README also had gaps rather than errors. It now describes what `parse` and
`fromNumber` accept, that every failure is a `MathError`, that the two
implementations of a type can not be mixed, what a scale and a precision mean,
what `divide` does without a scale or precision, and the ten integer
operations that were missing from the list.

## Suggested additions

### Missing basics

These are expected of a decimal library and are all absent:

* `abs`, `negate`, `sign`, `isZero`, `min` and `max`
* `remainder` for decimals, and `pow` with an integer exponent
* `toNumber()` and `toJSON()` on both families, and `Symbol.toPrimitive`
* Conversion between types: `Decimal` to and from `BigDecimal`, `Integer` to
  and from `BigInteger`, and `Integer` to `Decimal`
* `fromBigInt` on the big types. `BigDecimal.fromNumber` currently converts
  through a string.

### Quality of life

* E-notation in `toString`. Today `Decimal.parse('1e1000000').toString()`
  builds a string of one million characters.
* Static constants, such as `Decimal.ZERO` and `Decimal.ONE`.
* More generated test cases. `test/decimal/differential.test.ts` covers the
  decimal operations with a seeded generator and an exact reference. A library
  such as `fast-check` would add shrinking, which reports the smallest input
  that fails instead of the first one.
* A `Rational` or `Fraction` type. The package is named for numeric types, and
  exact fractions are the obvious third member.

## Remaining work

Nothing from this review is open. The critical defects, the problems that made
the two implementations of a type disagree, the missing basics, e-notation in
`toString` and the three design items above are all done, and the
documentation matches the code.

The one suggestion that is still worth doing is the `Rational` or `Fraction`
type. The arithmetic is now shared through `numeric-types/spi`, so a third
member of the family reuses it instead of writing its own.
