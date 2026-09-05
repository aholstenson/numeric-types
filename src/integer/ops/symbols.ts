/*
 * Keys for the internals of an integer. `Symbol.for` is used so that two
 * copies of this package in one dependency tree describe their values with the
 * same keys.
 */

/**
 * The arithmetic and the factory of an integer type.
 */
export const SPI = Symbol.for('numeric-types/integer/spi');

/**
 * The value that an integer holds.
 */
export const VALUE = Symbol.for('numeric-types/integer/value');
