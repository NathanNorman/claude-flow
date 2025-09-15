/**
 * Adds two numbers together with comprehensive input validation
 *
 * @description A robust calculator function that adds two numeric values.
 * Handles edge cases including null, undefined, and non-numeric inputs.
 * Returns NaN for invalid inputs following JavaScript conventions.
 *
 * @param {number|string} a - The first number to add (can be string representation of number)
 * @param {number|string} b - The second number to add (can be string representation of number)
 * @returns {number} The sum of a and b, or NaN if inputs are invalid
 *
 * @example
 * // Basic addition
 * addNumbers(5, 3);        // returns 8
 * addNumbers(2.5, 1.5);    // returns 4
 *
 * @example
 * // String numbers
 * addNumbers("10", "20");  // returns 30
 * addNumbers("5.5", 2);    // returns 7.5
 *
 * @example
 * // Edge cases
 * addNumbers(null, 5);     // returns NaN
 * addNumbers(undefined, 3); // returns NaN
 * addNumbers("abc", 5);    // returns NaN
 * addNumbers([], {});      // returns NaN
 *
 * @example
 * // Special numeric values
 * addNumbers(Infinity, 5); // returns Infinity
 * addNumbers(-Infinity, Infinity); // returns NaN
 * addNumbers(0, -0);       // returns 0
 *
 * @throws {TypeError} Never throws - returns NaN for invalid inputs instead
 * @since 1.0.0
 * @author Developer Agent
 */
function addNumbers(a, b) {
  // Input validation and type coercion
  const numA = parseFloat(a);
  const numB = parseFloat(b);

  // Check if either input is NaN after parsing
  if (isNaN(numA) || isNaN(numB)) {
    return NaN;
  }

  // Check for null or undefined inputs explicitly
  if (a === null || a === undefined || b === null || b === undefined) {
    return NaN;
  }

  // Perform addition
  const result = numA + numB;

  // Return the sum
  return result;
}

module.exports = addNumbers;
