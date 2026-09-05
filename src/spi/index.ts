/*
 * The arithmetic that the numeric types are built on. A type such as `Decimal`
 * is a value class plus one of these, so the same arithmetic serves several
 * types and a new type does not have to write its own.
 */

export * from './NumericOps.js';
export * from './IntegerOps.js';
export * from './deriveOps.js';

export { numberOps } from './numberOps.js';
export { bigIntOps } from './bigIntOps.js';
