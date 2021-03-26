import {validate} from '@/utils';

/**
 * Finds the number of decimal places in a floating point number
 *
 * @param {number} x - the number whose level of precision is to be determined
 * @return {number}
 */
const precision = (x = 0) => {
    const value = x.toString();

    const [_, fraction] = value.indexOf('e-') > 0
        ? value.split('e-')
        : value.split('.');

    return fraction ? fraction.length : 0;
};

/**
 * Perform a given arithmetic operation taking into account the floating point number problem
 *
 * @param {number} a - the first term in the arithmetic operation
 * @param {number} b - the second term in the arithmetic operation
 * @param {function} arithmetic - the arithemtic operation to perform
 *
 * @param {number} [exponent=1] - the factor of the normalizing denominator
 *
 * @return {number}
 */
const coercion = (a, b, arithmetic, exponent = 1) => {
    const getPlaceValue = (x) => Math.pow(10, precision(x));
    const factor = Math.max(getPlaceValue(a), getPlaceValue(b));

    const x = Math.round(a * factor);
    const y = Math.round(b * factor);

    return arithmetic(x, y) / Math.pow(factor, exponent);
};

const addition = (a, b) => {
    return validate.float(a) && validate.float(b)
        ? coercion(a, b, (x, y) => x + y, 1)
        : a + b;
};

const subtraction = (a, b) => {
    return validate.float(a) && validate.float(b)
        ? coercion(a, b, (x, y) => x - y, 1)
        : a - b;
};

const divison = (a, b) => {
    return a / b;
};

const multiplication = (a, b) => {
    return validate.float(a) || validate.float(b)
        ? coercion(a, b, (x, y) => x * y, 2)
        : a * b;
};

export {
    coercion,
    precision,
};

export default {
    divison,
    addition,
    subtraction,
    multiplication,
};
