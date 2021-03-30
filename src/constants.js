/** Default values */
export const AMOUNT = 0;
export const PRECISION = 2;
export const CURRENCY = 'XTS';


/**
 * Supported rounding strategies.
 */
export const SUPPORTED_ROUNDING_MODES = [
    'UP',
    'DOWN',
    'HALF_UP',
    'HALF_ODD',
    'HALF_DOWN',
    'HALF_EVEN',
    'HALF_TOWARDS_ZERO',
    'HALF_AWAY_FROM_ZERO',
];

/**
 * Regex that formats numbers with comma separator using lookbehind strategy
 */
export const COMMA_SEPARATOR_REGEX = {
    LOOKAHEAD_ASSRTIONS: /\B(?=(\d{3})+(?!\d))/g,
    NEGATIVE_LOOKBEHIND: /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
};
