import {SummationError} from '@/errors';
import {compute, validate} from '@/utils';

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
     * @param {object} props - an object that defines the monetary value
     *
     * @param {string} props.currency - a valid ISO 4217 codes for the currency e.g USD, KES
     * @param {number} props.precision - a positive integer indicating number of decimal places
     * @param {number|string} props.amount - a string or number for the initial value defaults to zero
     */
    constructor(props) {
        const valid = validate.props(props);

        this.#currency = valid.currency ? props.currency : 'Cowrie';
        this.#amount = valid.amount ? props.amount : 0;
        this.#precision = valid.precision ? props.precision : 2;
    }

    /**
     *
     */
    format() {

    }

    /**
     * Adds a sequence of numbers to the current amount
     *
     * @param  {...number} addends - A sequence of numerical values
     *
     * @throws {SummationError}
     *
     * @return {Cowrie}
     */
    plus(...addends) {
        const summand = validate.integer(this.#amount)
            ? parseInt(this.#amount)
            : parseFloat(this.#amount);

        const result = addends.every((x) => validate.integer(x)) && addends.reduce((sum, x) => {
            return compute.addition(sum, x);
        }, summand);

        if (result === false) throw SummationError;

        return new Cowrie({
            currency: this.#currency,
            amount: result,
            precision: this.#precision,
        });
    }
}

export default Cowrie;
