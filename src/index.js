import {compute, validate} from '@/utils';
import {RatioTypeError, SummationTypeError} from '@/errors';

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

        this.#currency = valid.currency ? props.currency : 'Cowrie';
        this.#amount = valid.amount ? props.amount : 0;
        this.#precision = valid.precision ? props.precision : 2;
    }

    /**
     * Returns the currenct currency code
     *
     * @return {String}
     */
    get currency() {
        return this.#currency;
    }

    /**
     * Returns the current numerical value
     *
     * @return {String}
     */
    get amount() {
        return this.#amount.toString();
    }

    /**
     * Returns the currenct precision i.e number of decimal places
     *
     * @return {Number}
     */
    get precision() {
        return this.#precision;
    }

    /**
     * Rounds off the current amount
     *
     * @param {Number} precision - the number of decimal places expected
     * @param {('UP'|'DOWN'|'HALF_UP'|'HALF_ODD'|'HALF_DOWN'|'HALF_EVEN'|'HALF_TOWARDS_ZERO'|'HALF_AWAY_FROM_ZERO')} [mode='HALF_AWAY_FROM_ZERO'] - the type of rounding strategy
     *
     * @return {Number}
     */
    roundOff(precision = this.#precision, mode) {
        return compute.rounding(this.#amount, precision, mode);
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
        const summand = validate.float(this.#amount)
            ? parseFloat(this.#amount)
            : parseInt(this.#amount);

        const result = addends.every((x) => validate.integer(x)) && addends.reduce((sum, x) => {
            return compute.addition(sum, x);
        }, summand);

        if (result === false) throw SummationTypeError;

        return new Cowrie({
            currency: this.#currency,
            amount: result,
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
        const minuend = validate.float(this.#amount)
            ? parseFloat(this.#amount)
            : parseInt(this.#amount);

        const result = subtrahends.every((x) => validate.integer(x)) && subtrahends.reduce((difference, x) => {
            return compute.subtraction(difference, x);
        }, minuend);

        if (result === false) throw SummationTypeError;

        return new Cowrie({
            currency: this.#currency,
            amount: result,
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
        const x = validate.float(this.#amount)
            ? parseFloat(this.#amount)
            : parseInt(this.#amount);

        const product = compute.multiplication(x, factor);

        return new Cowrie({
            currency: this.#currency,
            amount: product,
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
        const dividend = validate.integer(this.#amount)
            ? parseInt(this.#amount)
            : parseFloat(this.#amount);

        const quotient = compute.divison(dividend, divisor);

        return new Cowrie({
            currency: this.#currency,
            amount: quotient,
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

        const whole = validate.integer(this.#amount)
            ? parseInt(this.#amount)
            : parseFloat(this.#amount);

        const allocations = compute.allocation(whole, ratio, precision);

        return allocations.map((x) => {
            return new Cowrie({
                currency: this.#currency,
                amount: x,
                precision: this.#precision,
            });
        });
    }
}

export default Cowrie;
