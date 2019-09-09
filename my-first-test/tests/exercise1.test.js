const exercise1 = require('../exercise1');

describe('fizzBuzz', () => {
    it('should throw when input is not a number', () => {
        expect(() => {exercise1.fizzBuzz('Hello')}).toThrow();
    });

    it('should return fizzbuzz when number can be divided by 3 and 5', () => {
        const result = exercise1.fizzBuzz(3*5);
        expect(result).toBe('FizzBuzz');
    });

    it('should return Fizz when number can be divided by 3', () => {
        const result = exercise1.fizzBuzz(3);
        expect(result).toBe('Fizz');
    });

    
    it('should return Fizz when number can be divided by 5', () => {
        const result = exercise1.fizzBuzz(5);
        expect(result).toBe('Buzz');
    });

    it('should return the input when the number cant be divided by neither 3 nor 5', () => {
        const result = exercise1.fizzBuzz(7);
        expect(result).toBe(7);
    });
});