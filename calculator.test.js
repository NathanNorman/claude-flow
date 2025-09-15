/**
 * Comprehensive Test Suite for Enhanced Calculator
 * Created by Swarm Coordination System
 *
 * Test Coverage:
 * - Basic functionality
 * - Input validation
 * - Error handling
 * - Edge cases
 * - Type checking
 */

const Calculator = require('./calculator');

describe('Enhanced Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Constructor and Info', () => {
    test('should create calculator instance', () => {
      expect(calculator).toBeInstanceOf(Calculator);
    });

    test('should return correct info', () => {
      const info = calculator.getInfo();
      expect(info.name).toBe('Enhanced Calculator');
      expect(info.version).toBe('1.0.0');
      expect(info.features).toContain('input validation');
      expect(info.operations).toContain('add');
    });
  });

  describe('Addition', () => {
    describe('Valid Operations', () => {
      test('should add positive numbers', () => {
        expect(calculator.add(2, 3)).toBe(5);
        expect(calculator.add(10, 15)).toBe(25);
      });

      test('should add negative numbers', () => {
        expect(calculator.add(-2, -3)).toBe(-5);
        expect(calculator.add(-10, 5)).toBe(-5);
      });

      test('should add decimal numbers', () => {
        expect(calculator.add(0.1, 0.2)).toBeCloseTo(0.3);
        expect(calculator.add(2.5, 3.7)).toBeCloseTo(6.2);
      });

      test('should handle zero', () => {
        expect(calculator.add(0, 5)).toBe(5);
        expect(calculator.add(5, 0)).toBe(5);
        expect(calculator.add(0, 0)).toBe(0);
      });

      test('should handle large numbers', () => {
        expect(calculator.add(1000000, 2000000)).toBe(3000000);
      });
    });

    describe('Input Validation', () => {
      test('should throw TypeError for non-number first parameter', () => {
        expect(() => calculator.add('5', 3)).toThrow(TypeError);
        expect(() => calculator.add('5', 3)).toThrow('First parameter must be a number');
        expect(() => calculator.add(null, 3)).toThrow(TypeError);
        expect(() => calculator.add(undefined, 3)).toThrow(TypeError);
        expect(() => calculator.add([], 3)).toThrow(TypeError);
        expect(() => calculator.add({}, 3)).toThrow(TypeError);
      });

      test('should throw TypeError for non-number second parameter', () => {
        expect(() => calculator.add(5, '3')).toThrow(TypeError);
        expect(() => calculator.add(5, '3')).toThrow('Second parameter must be a number');
        expect(() => calculator.add(5, null)).toThrow(TypeError);
        expect(() => calculator.add(5, undefined)).toThrow(TypeError);
        expect(() => calculator.add(5, [])).toThrow(TypeError);
        expect(() => calculator.add(5, {})).toThrow(TypeError);
      });

      test('should throw Error for NaN parameters', () => {
        expect(() => calculator.add(NaN, 3)).toThrow('First parameter cannot be NaN');
        expect(() => calculator.add(5, NaN)).toThrow('Second parameter cannot be NaN');
      });

      test('should throw Error for Infinity parameters', () => {
        expect(() => calculator.add(Infinity, 3)).toThrow('First parameter must be finite');
        expect(() => calculator.add(5, Infinity)).toThrow('Second parameter must be finite');
        expect(() => calculator.add(-Infinity, 3)).toThrow('First parameter must be finite');
        expect(() => calculator.add(5, -Infinity)).toThrow('Second parameter must be finite');
      });
    });
  });

  describe('Subtraction', () => {
    test('should subtract positive numbers', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
      expect(calculator.subtract(10, 15)).toBe(-5);
    });

    test('should subtract negative numbers', () => {
      expect(calculator.subtract(-2, -3)).toBe(1);
      expect(calculator.subtract(-10, 5)).toBe(-15);
    });

    test('should handle zero', () => {
      expect(calculator.subtract(5, 0)).toBe(5);
      expect(calculator.subtract(0, 5)).toBe(-5);
      expect(calculator.subtract(0, 0)).toBe(0);
    });

    test('should throw for invalid inputs', () => {
      expect(() => calculator.subtract('5', 3)).toThrow(TypeError);
      expect(() => calculator.subtract(5, NaN)).toThrow(Error);
    });
  });

  describe('Multiplication', () => {
    test('should multiply positive numbers', () => {
      expect(calculator.multiply(3, 4)).toBe(12);
      expect(calculator.multiply(2.5, 4)).toBe(10);
    });

    test('should multiply negative numbers', () => {
      expect(calculator.multiply(-3, 4)).toBe(-12);
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    test('should handle zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
      expect(calculator.multiply(0, 5)).toBe(0);
      expect(calculator.multiply(0, 0)).toBe(0);
    });

    test('should throw for invalid inputs', () => {
      expect(() => calculator.multiply('5', 3)).toThrow(TypeError);
      expect(() => calculator.multiply(5, Infinity)).toThrow(Error);
    });
  });

  describe('Division', () => {
    test('should divide positive numbers', () => {
      expect(calculator.divide(12, 4)).toBe(3);
      expect(calculator.divide(10, 2.5)).toBe(4);
    });

    test('should divide negative numbers', () => {
      expect(calculator.divide(-12, 4)).toBe(-3);
      expect(calculator.divide(-12, -4)).toBe(3);
    });

    test('should handle zero dividend', () => {
      expect(calculator.divide(0, 5)).toBe(0);
    });

    test('should throw Error for division by zero', () => {
      expect(() => calculator.divide(5, 0)).toThrow('Division by zero is not allowed');
      expect(() => calculator.divide(-5, 0)).toThrow('Division by zero is not allowed');
      expect(() => calculator.divide(0, 0)).toThrow('Division by zero is not allowed');
    });

    test('should throw for invalid inputs', () => {
      expect(() => calculator.divide('5', 3)).toThrow(TypeError);
      expect(() => calculator.divide(5, NaN)).toThrow(Error);
    });
  });

  describe('Power', () => {
    test('should calculate positive powers', () => {
      expect(calculator.power(2, 3)).toBe(8);
      expect(calculator.power(5, 2)).toBe(25);
      expect(calculator.power(3, 0)).toBe(1);
    });

    test('should handle negative bases and exponents', () => {
      expect(calculator.power(-2, 3)).toBe(-8);
      expect(calculator.power(2, -2)).toBe(0.25);
      expect(calculator.power(-2, 2)).toBe(4);
    });

    test('should handle fractional exponents', () => {
      expect(calculator.power(4, 0.5)).toBe(2);
      expect(calculator.power(8, 1 / 3)).toBeCloseTo(2, 10);
    });

    test('should throw for invalid inputs', () => {
      expect(() => calculator.power('5', 3)).toThrow(TypeError);
      expect(() => calculator.power(5, NaN)).toThrow(Error);
    });
  });

  describe('Square Root', () => {
    test('should calculate square root of positive numbers', () => {
      expect(calculator.sqrt(4)).toBe(2);
      expect(calculator.sqrt(9)).toBe(3);
      expect(calculator.sqrt(16)).toBe(4);
      expect(calculator.sqrt(2)).toBeCloseTo(1.414, 3);
    });

    test('should handle zero', () => {
      expect(calculator.sqrt(0)).toBe(0);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.sqrt(0.25)).toBe(0.5);
      expect(calculator.sqrt(1.44)).toBeCloseTo(1.2, 10);
    });

    test('should throw Error for negative numbers', () => {
      expect(() => calculator.sqrt(-1)).toThrow('Cannot calculate square root of negative number');
      expect(() => calculator.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
    });

    test('should throw for invalid inputs', () => {
      expect(() => calculator.sqrt('5')).toThrow(TypeError);
      expect(() => calculator.sqrt(NaN)).toThrow(Error);
      expect(() => calculator.sqrt(Infinity)).toThrow(Error);
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    test('should handle very small numbers', () => {
      expect(calculator.add(0.0000001, 0.0000001)).toBeCloseTo(0.0000002, 10);
    });

    test('should handle numbers close to JavaScript limits', () => {
      const largeNum = Number.MAX_SAFE_INTEGER - 1;
      expect(calculator.add(largeNum, 1)).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('should detect overflow in operations', () => {
      expect(() => calculator.multiply(Number.MAX_VALUE, 2)).toThrow('overflow');
    });
  });

  describe('Method Chaining and Complex Operations', () => {
    test('should work with chained operations', () => {
      // (5 + 3) * 2 = 16
      const result1 = calculator.add(5, 3);
      const result2 = calculator.multiply(result1, 2);
      expect(result2).toBe(16);

      // sqrt(16) / 2 = 2
      const result3 = calculator.sqrt(result2);
      const result4 = calculator.divide(result3, 2);
      expect(result4).toBe(2);
    });
  });
});
