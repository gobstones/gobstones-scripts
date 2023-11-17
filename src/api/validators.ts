/**
 * Some validator's that are used by both the API and the CLI.
 *
 * @internal
 * @module Internal.Validator
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { display } from '../cli/cli_helpers';
import { exit } from 'process';

/**
 * Return the error message that should be shown when and argument does not
 * meet one of the required/available values.
 *
 * @param option The offending argument option's name.
 * @param value The value given as argument.
 * @param available The list of available values for that option.
 *
 * @returns The error message for the invalid option given.
 */
function invalidValueForOption(option: string, value: string, available: string[]): string {
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
 * @param value The value given as argument.
 * @param values The available values to choose from.
 *
 * @returns true if it's valid, false otherwise.
 *
 * @static
 * @internal
 * @memberof API.Validator
 */
const isValidOption = (value: string, values: string[]): boolean => values.indexOf(value) >= 0;

/**
 * Throw an error if the given value is not a valid option for the given argumentName.
 *
 * @param value The value that was given.
 * @param option The offending argument option's name.
 * @param values The available values.
 *
 * @throws if the value if not one of the available ones.
 *
 * @group Internal API Functions
 */
export function failIfArgumentInvalid(value: string, option: string, values: string[]): void {
    if (values.indexOf(value) < 0) {
        throw invalidValueForOption(option, value, values);
    }
}

/**
 * Throw an error if the given value is not a valid option for the given argumentName.
 *
 * @param options The object containing all options.
 * @param optionName The offending argument option's name.
 * @param values The available values.
 *
 * @throws if the value if not one of the available ones.
 *
 * @group Internal API Functions
 */
export function failIfOptionInvalid(options: any, optionName: string, values: string[]): void {
    const optionNameNormalized = optionName.replace(/-(.)/g, (_, group1) => group1.toUpperCase());
    if (options[optionNameNormalized] && !isValidOption(options[optionNameNormalized], values)) {
        display(invalidValueForOption(optionName, options[optionNameNormalized], values), 'bgRed');
        exit(1);
    }
}
