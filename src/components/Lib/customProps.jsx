//import propTypes from 'prop-types';
import validator from 'validator';

export const validateUrl = (props, propName, componentName) => {
  if (validator.isURL(props[propName], {protocols: ['http', 'https']})) {
    return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`, expected URL, supplied with ' +
        typeof props[propName] + '. Validation failed.',
    );
  }
};