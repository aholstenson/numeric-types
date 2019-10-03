import { CustomError } from 'ts-custom-error';

/**
 * Error used for mathematical issues, such as numbers not fitting within the
 * defined range of a type, or invalid mathematical operations.
 */
export class MathError extends CustomError {
}
