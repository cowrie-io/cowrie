export default {
    defined(x) {
        return typeof x !== 'undefined';
    },

    float(x) {
        return !isNaN(parseFloat(x)) && isFinite(x) && !Number.isInteger(x);
    },

    integer(x) {
        return !isNaN(parseInt(x)) && isFinite(x);
    },

    string(x) {
        return typeof x === 'string' || x instanceof String;
    },

    ratio(x) {
        return x.length > 0 && x.every((term) => term >= 0) && x.some((term) => term > 0);
    },

    props(x) {
        if (!this.defined(x)) {
            return {
                amount: false,
                currency: false,
                precision: false,
            };
        }

        const {amount, precision, currency} = x;

        return {
            currency: this.string(currency),
            precision: this.defined(precision) && this.integer(amount),
            amount: this.defined(amount) && (this.float(amount) || this.integer(amount)),
        };
    },
};
