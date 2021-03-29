import {SUPPORTED_ROUNDING_MODES} from '@/constants';

export const SummationTypeError = new TypeError('Expected summation values to be numerical');

export const RoundingTypeError = new TypeError('Expected rounding off to be one of ' + SUPPORTED_ROUNDING_MODES.join(', '));

export const RatioTypeError = new TypeError('Expected ratio should have a have atleast one non-zero term');

