const validate = {
    defined(x) {
        return typeof x !== 'undefined';
    },
    string(x) {
        return typeof x === 'string' || x instanceof String;
    },
    integer(x) {
        return !isNaN(parseInt(x)) && isFinite(x) && Number.isInteger(x);
    },
    decimal(x) {
        return !isNaN(parseFloat(x)) && isFinite(x) && !Number.isInteger(x);
    },
    ratio(x) {
        return (
            x.length > 1 && x.every((term) => term >= 0) && x.some((term) => term > 0)
        );
    },
};

describe('validation module', () => {
    it('asserts a value is defined', () => {
        const obj = {name: 'Jest'};
        const func = () => {};

        expect(validate.defined(func())).toBe(false);
        expect(validate.defined(undefined)).toBe(false);
        expect(validate.defined(obj?.prop)).toBe(false);

        expect(validate.defined(func)).toBe(true);
        expect(validate.defined(null)).toBe(true);
        expect(validate.defined(obj?.name)).toBe(true);
    });

    it('asserts a varaible is a string', () => {
        expect(validate.string('')).toBe(true);
        // eslint-disable-next-line no-new-wrappers
        expect(validate.string(new String())).toBe(true);
        expect(validate.string((100).toString())).toBe(true);
        expect(validate.string(JSON.stringify(null).toString())).toBe(true);
    });

    it('asserts a number is an integer', () => {
        expect(validate.integer(1 / 0)).toBe(false);
        expect(validate.integer(1e-10)).toBe(false);
        expect(validate.integer(1 / 2)).toBe(false);
        expect(validate.integer(Number.MIN_VALUE)).toBe(false);

        expect(validate.integer(Number.MAX_VALUE)).toBe(true);
    });

    it('asserts a number is rational', () => {
        expect(validate.decimal(1e10)).toBe(false);
        expect(validate.decimal(1 / 0)).toBe(false);
        expect(validate.decimal(2 / 1)).toBe(false);

        expect(validate.decimal(Number.MIN_VALUE)).toBe(true);
    });

    it('asserts an array is a valid ratio', () => {
        expect(validate.ratio([])).toBe(false);
        expect(validate.ratio([1])).toBe(false);
        expect(validate.ratio([100])).toBe(false);
        expect(validate.ratio([0, 0])).toBe(false);

        expect(validate.ratio([2, 2])).toBe(true);
        expect(validate.ratio([1, 2])).toBe(true);
    });
});
