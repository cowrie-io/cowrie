import {compute, validate} from '@/utils';
import {RatioTypeError, SummationTypeError} from '@/errors';
import {AMOUNT, CURRENCY, PRECISION, COMMA_SEPARATOR_REGEX} from '@/constants';

/**
 * Cowrie object - a composite data type to represent a given monetary value
 * @type {Cowrie}
 */
class Cowrie {
    #currency;
    #amount;
    #precision;

    /**
     * Creates an instance of the Cowrie object
     *
     * @param {Object} props - an object that defines the monetary value
     *
     * @param {String} props.currency - a valid ISO 4217 codes for the currency e.g USD, KES
     * @param {Number} props.precision - a positive integer indicating number of decimal places
     * @param {Number|String} props.amount - a string or number for the initial value defaults to zero
     */
    constructor(props) {
        const valid = validate.props(props);

        this.#amount = valid.amount ? props.amount : AMOUNT;
        this.#currency = valid.currency ? props.currency : CURRENCY;
        this.#precision = valid.precision ? props.precision : PRECISION;
    }

    /**
     * Returns the current currency
     *
     * @return {String}
     */
    get currency() {
        return this.#currency;
    }

    /**
     * Returns the current amount
     *
     * @return {Number}
     */
    get amount() {
        return validate.float(this.#amount)
            ? parseFloat(this.#amount)
            : parseInt(this.#amount);
    }

    /**
     * Returns the current currency
     *
     * @return {Number}
     */
    get precision() {
        return this.#precision;
    }

    /**
     * Returns a formatted representation of the monetary value
     *
     * @param {Boolean} [prettier=true] - Flag to display human-readable (comma-separated) format
     * @param {Number} [precision=PRECISION] - The number of decimal places to display
     * @param {String} [rounding='HALF_AWAY_FROM_ZERO'] - The rounding strategy
     *
     * @return {String}
     */
    format(prettier = true, precision = PRECISION, rounding = 'HALF_AWAY_FROM_ZERO') {
        const rounded = compute.rounding(this.#amount, precision, rounding);

        let output;
        if (prettier === true) {
            try {
                output = rounded.toString().replace(COMMA_SEPARATOR_REGEX.NEGATIVE_LOOKBEHIND, ',');
            } catch (error) {
                output = rounded.toString().replace(COMMA_SEPARATOR_REGEX.LOOKAHEAD_ASSRTIONS, ',');
            }
        }

        return output;
    }

    /**
     * Adds a sequence of numbers to the current amount
     *
     * @param  {...Number} addends - A sequence of numerical values to add to the amount
     *
     * @throws {SummationTypeError}
     *
     * @return {Cowrie}
     */
    plus(...addends) {
        const summand = this.amount;

        const result = addends.every((x) => validate.integer(x)) && addends.reduce((sum, x) => {
            return compute.addition(sum, x);
        }, summand);

        if (result === false) throw SummationTypeError;

        return new Cowrie({
            amount: result,
            currency: this.#currency,
            precision: this.#precision,
        });
    }

    /**
     * Subtracts a sequence of numbers from the current amount
     *
     * @param  {...Number} subtrahends - A sequence of numerical values to subtract from the amount
     *
     * @throws {SummationTypeError}
     *
     * @return {Cowrie}
     */
    minus(...subtrahends) {
        const minuend = this.amount;

        const result = subtrahends.every((x) => validate.integer(x)) && subtrahends.reduce((difference, x) => {
            return compute.subtraction(difference, x);
        }, minuend);

        if (result === false) throw SummationTypeError;

        return new Cowrie({
            amount: result,
            currency: this.#currency,
            precision: this.#precision,
        });
    }

    /**
     * Multiply the current amount by a given factor
     *
     * @param  {Number} factor - A positive or negative number to multiply the amount
     * @return {Cowrie}
     */
    times(factor) {
        const product = compute.multiplication(this.amount, factor);

        return new Cowrie({
            amount: product,
            currency: this.#currency,
            precision: this.#precision,
        });
    }

    /**
     * Divide the current amount by a given quotient
     *
     * @param  {number} divisor - A positive or negative number to divde the amount
     * @return {Cowrie}
     */
    divide(divisor) {
        const dividend = this.amount;

        const quotient = compute.divison(dividend, divisor);

        return new Cowrie({
            amount: quotient,
            currency: this.#currency,
            precision: this.#precision,
        });
    }

    /**
     * Split the amount by the given allocation percentage or ratio
     *
     * @param  {Array.<Number>} ratio - An array representing the fractional allocations e.g ratio of 2:1 => [2, 1]
     * @param  {Number} precision - the number of decimal places expected
     * @return {Array.<Cowrie>}
     */
    allocate(ratio, precision) {
        if (!validate.ratio(ratio)) throw RatioTypeError;

        const allocations = compute.allocation(this.amount, ratio, precision);

        return allocations.map((x) => {
            return new Cowrie({
                amount: x,
                currency: this.#currency,
                precision: this.#precision,
            });
        });
    }
}

export default Cowrie;
