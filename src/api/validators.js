/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @namespace API.Validator
 */

const { exit } = require('process');
const { display } = require('../cli/cli_helpers');

/**
 * Return the error message that should be shown when and argument does not
 * meet one of the required/available values.
 *
 * @param {string} option The offending argument option's name.
 * @param {string} value The value given as argument.
 * @param {Array.<sting>} available The list of available values for that option.
 *
 * @returns {string}
 *
 * @memberof API.Validator
 */
function invalidValueForOption(option, value, available) {
    let availableString = '"' + available.join('", "') + '"';
    const lastComma = availableString.lastIndexOf(', ');
    availableString =
        availableString.substring(0, lastComma) + ' or' + availableString.substring(lastComma + 1);

    return (
        `The value "${value}" is not a valid option for the argument "${option}"\n` +
        `One of ${availableString} should be provided`
    );
}

/**
 * Answers wether the given value is one of the available values for an option.
 *
 * @param {string} value The value given as argument
 * @param {Array.<string>} values The available values to choose from.
 *
 * @returns {boolean}
 * @memberof API.Validator
 */
function isValidOption(value, values) {
    return values.indexOf(value) >= 0;
}

/**
 * Throw an error if the given value is not a valid option for the given argumentName.
 *
 * @param {string} value The value that was given.
 * @param {string} option The offending argument option's name.
 * @param {Array.string} values The available values.
 *
 * @throws {string} if the value if not one of the available ones.
 *
 * @static
 * @memberof API.Validator
 */
function failIfArgumentInvalid(value, option, values) {
    if (values.indexOf(value) < 0) {
        throw invalidValueForOption(option, value, values);
    }
}

/**
 * Throw an error if the given value is not a valid option for the given argumentName.
 *
 * @param {Object.<string, string>} options The object containing all options.
 * @param {string} optionName The offending argument option's name.
 * @param {Array.string} values The available values.
 *
 * @throws {string} if the value if not one of the available ones.
 *
 * @static
 * @memberof API.Validator
 */
function failIfOptionInvalid(options, optionName, values) {
    const optionNameNormalized = optionName.replace(/-(.)/g, (_, group1) => group1.toUpperCase());
    if (options[optionNameNormalized] && !isValidOption(options[optionNameNormalized], values)) {
        display(invalidValueForOption(optionName, options[optionNameNormalized], values), 'bgRed');
        exit(1);
    }
}

module.exports = {
    failIfArgumentInvalid,
    failIfOptionInvalid
};
