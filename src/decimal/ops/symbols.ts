/*
 * Keys for the internals of a decimal. `Symbol.for` is used so that two copies
 * of this package in one dependency tree describe their values with the same
 * keys.
 */

/**
 * The arithmetic and the factory of a decimal type.
 */
export const SPI = Symbol.for('numeric-types/decimal/spi');

/**
 * Coefficient part of a decimal.
 */
export const COEFFICIENT = Symbol.for('numeric-types/decimal/coefficient');

/**
 * Exponent part of a decimal.
 */
export const EXPONENT = Symbol.for('numeric-types/decimal/exponent');
