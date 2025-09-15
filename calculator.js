/**
 * Enhanced Calculator with comprehensive input validation and error handling
 * Created by Swarm Coordination System
 *
 * Features:
 * - Type validation for all inputs
 * - Comprehensive error handling
 * - JSDoc documentation
 * - Support for edge cases
 */

class Calculator {
  /**
   * Validates that a value is a number
   * @param {*} value - The value to validate
   * @param {string} paramName - The parameter name for error reporting
   * @throws {TypeError} If value is not a number
   * @throws {Error} If value is NaN or Infinity
   */
  _validateNumber(value, paramName) {
    if (typeof value !== 'number') {
      throw new TypeError(`${paramName} must be a number, got ${typeof value}`);
    }

    if (isNaN(value)) {
      throw new Error(`${paramName} cannot be NaN`);
    }

    if (!isFinite(value)) {
      throw new Error(`${paramName} must be finite, got ${value}`);
    }
  }

  /**
   * Validates that two values are numbers
   * @param {*} a - First value
   * @param {*} b - Second value
   * @throws {TypeError|Error} If validation fails
   */
  _validateTwoNumbers(a, b) {
    this._validateNumber(a, 'First parameter');
    this._validateNumber(b, 'Second parameter');
  }

  /**
   * Adds two numbers together with comprehensive validation
   * @param {number} a - The first number
   * @param {number} b - The second number
   * @returns {number} The sum of a and b
   * @throws {TypeError} If either parameter is not a number
   * @throws {Error} If either parameter is NaN or Infinity
   *
   * @example
   * const calc = new Calculator();
   * console.log(calc.add(5, 3)); // 8
   * console.log(calc.add(-2, 7)); // 5
   * console.log(calc.add(0.1, 0.2)); // 0.3
   */
  add(a, b) {
    // Validate inputs
    this._validateTwoNumbers(a, b);

    // Perform calculation
    const result = a + b;

    // Validate result
    if (!isFinite(result)) {
      throw new Error(`Addition result overflow: ${a} + ${b} = ${result}`);
    }

    return result;
  }

  /**
   * Subtracts the second number from the first
   * @param {number} a - The minuend
   * @param {number} b - The subtrahend
   * @returns {number} The difference
   * @throws {TypeError} If either parameter is not a number
   * @throws {Error} If either parameter is NaN or Infinity
   */
  subtract(a, b) {
    this._validateTwoNumbers(a, b);

    const result = a - b;

    if (!isFinite(result)) {
      throw new Error(`Subtraction result overflow: ${a} - ${b} = ${result}`);
    }

    return result;
  }

  /**
   * Multiplies two numbers
   * @param {number} a - The first factor
   * @param {number} b - The second factor
   * @returns {number} The product
   * @throws {TypeError} If either parameter is not a number
   * @throws {Error} If either parameter is NaN or Infinity
   */
  multiply(a, b) {
    this._validateTwoNumbers(a, b);

    const result = a * b;

    if (!isFinite(result)) {
      throw new Error(`Multiplication result overflow: ${a} * ${b} = ${result}`);
    }

    return result;
  }

  /**
   * Divides the first number by the second
   * @param {number} a - The dividend
   * @param {number} b - The divisor
   * @returns {number} The quotient
   * @throws {TypeError} If either parameter is not a number
   * @throws {Error} If either parameter is NaN, Infinity, or if b is zero
   */
  divide(a, b) {
    this._validateTwoNumbers(a, b);

    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }

    const result = a / b;

    if (!isFinite(result)) {
      throw new Error(`Division result overflow: ${a} / ${b} = ${result}`);
    }

    return result;
  }

  /**
   * Raises a number to a power
   * @param {number} base - The base number
   * @param {number} exponent - The exponent
   * @returns {number} The result of base^exponent
   * @throws {TypeError} If either parameter is not a number
   * @throws {Error} If parameters are invalid or result overflows
   */
  power(base, exponent) {
    this._validateTwoNumbers(base, exponent);

    const result = Math.pow(base, exponent);

    if (!isFinite(result)) {
      throw new Error(`Power result overflow: ${base}^${exponent} = ${result}`);
    }

    return result;
  }

  /**
   * Calculates the square root of a number
   * @param {number} n - The number to find square root of
   * @returns {number} The square root
   * @throws {TypeError} If parameter is not a number
   * @throws {Error} If parameter is negative, NaN, or Infinity
   */
  sqrt(n) {
    this._validateNumber(n, 'Parameter');

    if (n < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }

    const result = Math.sqrt(n);

    if (!isFinite(result)) {
      throw new Error(`Square root result overflow: sqrt(${n}) = ${result}`);
    }

    return result;
  }

  /**
   * Returns basic information about the calculator
   * @returns {object} Calculator metadata
   */
  getInfo() {
    return {
      name: 'Enhanced Calculator',
      version: '1.0.0',
      features: ['input validation', 'error handling', 'overflow detection'],
      operations: ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'],
    };
  }
}

module.exports = Calculator;
