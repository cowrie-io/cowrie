import Decimal from 'big.js';

/** Money data-type */
class Cowrie {
    #currency;
    #amount;
    #precision;

    #roundingTypes = {
        ROUND_UP: 3,
        ROUND_DOWN: 0,
        ROUND_HALF_UP: 1,
        ROUND_HALF_EVEN: 2,
    };

    /**
     * Performs a series of checks
     */
    #check(currency, amounnt, precision) {

    }

    /**
     * Create money
     * @param {string} currency
     * @param {number} amount
     * @param {number} precision
     */
    constructor(currency, amount, precision = 2) {
        this.#currency = currency;
        this.#amount = amount;
        this.#precision = precision;
    }

    /**
     * Retrieve the amount in figures
     * Defaults to 2 decimal places
     */
    get figure() {
        let amt = this.#amount;
        if (!(amt instanceof Decimal)) {
            amt = new Decimal(this.#amount);
        }

        return amt.toFixed(this.#precision);
    }

    /**
     * Add the provided numbers to our current amount
     * @param  {...any} x
     * @return {Decimal}
     */
    plus(...x) {
        const sum = x.reduce((sigma, x) => {
            return sigma.plus(x);
        }, new Decimal(this.#amount));

        return new Cowrie(this.#currency, sum, this.#precision);
    }


    /**
     * Subtract the provided numbers to our current amount
     * @param  {...any} x
     * @return {Decimal}
     */
    minus(...x) {
        const difference = x.reduce((sigma, x) => {
            return sigma.minus(x);
        }, new Decimal(this.#amount));

        return new Cowrie(this.#currency, difference, this.#precision);
    }

    /**
     * Multiply the current amount by a given factor
     * @param  {number} x
     * @return {Decimal}
     */
    times(x) {
        const product = new Decimal(this.#amount).times(x);

        return new Cowrie(this.#currency, product, this.#precision);
    }

    /**
     * Divide the current amount by a given quotient
     * @param  {number} x
     * @return {Decimal}
     */
    divide(x) {
        const quotient = new Decimal(this.#amount).div(x);

        return new Cowrie(this.#currency, quotient, this.#precision);
    }

    /**
     * Split the current amount by the given percentage ratio
     * @param  {Array} ratio
     * @return {Array}
     */
    allocate(ratio) {
        const commonFactor = new Decimal(100).div(ratio.reduce((a, b) => a+b));

        return ratio.map((x, i) => {
            const percentage = commonFactor.times(x);
            const allocation = new Decimal(this.#amount).times(percentage).div(100);

            const amount = i % 2 == 0
                ? allocation.round(this.#precision, 3)
                : allocation.round(this.#precision, 0);

            return new Cowrie(this.#currency, amount, this.#precision);
        });
    }
}

export default Cowrie;
