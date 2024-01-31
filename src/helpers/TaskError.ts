/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

/**
 * Represents an exception that is thrown if the configuration
 * for nps is wrongly defined.
 *
 * @internal
 * @group Internal: Errors
 */
export class TaskConfigurationError extends Error {
    public constructor(msg: string) {
        super('nps task configuration error: ' + msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, TaskConfigurationError.prototype);
    }
}
