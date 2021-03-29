import {validate} from '@/utils';
import {RoundingTypeError} from '@/errors';
import {SUPPORTED_ROUNDING_MODES} from '@/constants';

/**
 * Returns decimal places of a given number
 *
 * @param {Number} x - the number whose level of precision is to be determined
 * @return {Number}
 */
const precision = (x = 0) => {
    const value = x.toString();

    // eslint-disable-next-line no-unused-vars
    const [_, fraction] = value.indexOf('e-') > 0
        ? value.split('e-')
        : value.split('.');

    return fraction ? fraction.length : 0;
};

/**
 * Returns the result of a given arithmetic involving one or more floating point numbers
 *
 * @param {Number} a - the first term in the arithmetic operation
 * @param {Number} b - the second term in the arithmetic operation
 * @param {Function} arithmetic - the arithemtic operation to perform
 *
 * @param {Number} [exponent=1] - the factor of the normalizing denominator
 *
 * @return {Number}
 */
const coercion = (a, b, arithmetic, exponent = 1) => {
    const getPlaceValue = (x) => Math.pow(10, precision(x));
    const factor = Math.max(getPlaceValue(a), getPlaceValue(b));

    const x = Math.round(a * factor);
    const y = Math.round(b * factor);

    return arithmetic(x, y) / Math.pow(factor, exponent);
};

/**
 * Returns a number that has been rounded off to a given decimal place
 *
 * @param {Number} a - the number to round off
 * @param {Number} precision - the decimal places to output
 * @param {('UP'|'DOWN'|'HALF_UP'|'HALF_ODD'|'HALF_DOWN'|'HALF_EVEN'|'HALF_TOWARDS_ZERO'|'HALF_AWAY_FROM_ZERO')} [mode='HALF_AWAY_FROM_ZERO'] - the type of rounding strategy
 *
 * @throws {RoundingTypeError}
 *
 * @return {Number}
 */
const rounding = (a, precision, mode = 'HALF_AWAY_FROM_ZERO') => {
    const even = (x) => x % 2 === 0;
    const halve = (x) => Math.abs(x) % 1 === 0.5;

    if (validate.defined(mode) && !SUPPORTED_ROUNDING_MODES.includes(mode)) throw RoundingTypeError;

    let result;
    const factor = Math.pow(10, precision);
    const x = coercion(a, factor, (x, y) => x * y, 2);

    switch (mode) {
        case 'UP':
            result = Math.ceil(x);
            break;

        case 'DOWN':
            result = Math.floor(x);
            break;

        case 'HALF_UP':
            result = Math.round(x);
            break;

        case 'HALF_DOWN':
            result = even(x) ? Math.floor(x) : Math.round(x);
            break;

        case 'HALF_EVEN':
            result = halve(x)
                ? even( Math.round(x)) ? Math.round(x) : Math.round(x) - 1
                : Math.round(x);
            break;

        case 'HALF_ODD':
            result = halve(x)
                ? even(Math.round(x)) ? Math.round(x) - 1 : Math.round(x)
                : Math.round(x);
            break;

        case 'HALF_TOWARDS_ZERO':
            result = halve(x)
                ? Math.sign(x) * Math.floor(Math.abs(x))
                : Math.round(x);
            break;

        case 'HALF_AWAY_FROM_ZERO':
            result = halve(x)
                ? Math.sign(x) * Math.ceil(Math.abs(x))
                : Math.round(x);
            break;
    }

    return result / factor;
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

const allocation = (a, ratio, precision) => {
    const denominator = ratio.reduce((sum, x) => {
        return addition(sum, x);
    }, 0);

    return ratio.map((numerator, position) => {
        const fraction = divison(numerator, denominator);

        const amount = multiplication(a, fraction);

        const ROUNDING_MODE = position % 2
            ? 'UP'
            : 'DOWN';

        return rounding(amount, precision, ROUNDING_MODE);
    });
};

export {
    coercion,
    precision,
};

export default {
    divison,
    rounding,
    addition,
    allocation,
    subtraction,
    multiplication,
};
