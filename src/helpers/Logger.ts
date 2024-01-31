/**
 * @module Internal.Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */
import colors from 'ansi-colors';

/**
 * The different available log levels.
 *
 * @internal
 * @group Internal: Types
 */
export enum LogLevel {
    Error = 'error',
    Warn = 'warn',
    Info = 'info',
    Debug = 'debug'
}

/**
 * This class provides a centralize way to report messages in the terminal through
 * the application, including messages that are always printed, debug information,
 * error messages and others.
 *
 * @internal
 * @group Internal: Classes
 */
export class Logger {
    /** Whether this logger is turned on */
    private _on: boolean;

    /** Create a new logger */
    public constructor(public level: LogLevel) {
        this._on = true;
    }

    /**
     * Turn this logger on. If already on, nothing happens.
     *
     * @returns the receiver logger.
     */
    public on(): Logger {
        this._on = true;
        return this;
    }

    /**
     * Turn this logger off. If already off, nothing happens.
     *
     * @returns the receiver logger.
     */
    public off(): Logger {
        this._on = false;
        return this;
    }

    /**
     * Log a message as an error, if the level allows it and the logger is on.
     *
     * @param msg The message to print.
     * @param style A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public error(msg: string, style?: string): Logger {
        this.print(msg, style, LogLevel.Error);
        return this;
    }

    /**
     * Log a message as an warning, if the level allows it and the logger is on.
     *
     * @param msg The message to print.
     * @param style A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public warn(msg: string, style?: string): Logger {
        this.print(msg, style, LogLevel.Warn);
        return this;
    }

    /**
     * Log a message as information, if the level allows it and the logger is on.
     *
     * @param msg The message to print.
     * @param style A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public info(msg: string, style?: string): Logger {
        this.print(msg, style, LogLevel.Info);
        return this;
    }

    /**
     * Log a message as debug information, if the level allows it and the logger is on.
     *
     * @param msg The message to print.
     * @param style A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public debug(msg: string, style?: string): Logger {
        this.print(msg, style, LogLevel.Debug);
        return this;
    }

    /**
     * Log a message regardless of the active level, but only if the logger is on.
     *
     * @param msg The message to print.
     * @param style A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public log(msg: string, style?: string): Logger {
        this.print(msg, style);
        return this;
    }

    /**
     * Print the given message in the terminal, if the log level allows it and the logger is on.
     *
     * @param msg The message to print
     * @param style The style to use for printing.
     * @param actualLevel The actual level on which the message should be printed.
     */
    private print(msg: string, style?: string, actualLevel?: LogLevel): void {
        if (this._on && (!actualLevel || this.isLevelGeqThan(actualLevel, this.level))) {
            if (style) {
                msg = colors[style](msg);
            }
            // eslint-disable-next-line no-console
            console.log(msg);
        }
    }

    /**
     * Answers if the first level is greater or equal than the second one.
     *
     * @param level1 The first level to compare
     * @param level2 The second level to compare.
     *
     * @returns true if the first level is greater or equal than the second.
     */
    private isLevelGeqThan(level1: LogLevel, level2: LogLevel): boolean {
        return (
            level1 === LogLevel.Error ||
            (level1 === LogLevel.Warn && level2 !== LogLevel.Error) ||
            (level1 === LogLevel.Info && level2 !== LogLevel.Error && level2 !== LogLevel.Warn) ||
            level2 === LogLevel.Debug
        );
    }
}

/**
 * The default {@link Logger}.
 *
 * @internal
 * @group Internal: Objects
 */
export const logger = new Logger(LogLevel.Error);
