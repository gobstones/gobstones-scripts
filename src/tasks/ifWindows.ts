/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 * @module API.Tasks
 */
import { isWindows } from '../helpers/isWindows';

/**
 * Takes two scripts as a string and returns the first
 * if the current environment is windows, and the second
 * if the current environment is not windows
 *
 * @param script the script to use for windows
 * @param altScript the script to use for non-windows
 *
 * @return The bash script, first if system is windows, second if not.
 *
 * @group Main API Functions
 */
export const ifWindows = (script: string, altScript: string): string => (isWindows() ? script : altScript);
