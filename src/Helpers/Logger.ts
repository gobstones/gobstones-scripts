/*
 * *****************************************************************************
 * Copyright (C) National University of Quilmes 2018-2024
 * Gobstones (TM) is a trademark of the National University of Quilmes.
 *
 * This program is free software distributed under the terms of the
 * GNU Affero General Public License version 3.
 * Additional terms added in compliance to section 7 of such license apply.
 *
 * You may read the full license at https://gobstones.github.io/gobstones-guidelines/LICENSE.
 * *****************************************************************************
 */

/**
 * @module Helpers
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 *
 * @internal
 */

import chalk from 'chalk';

/**
 * The different available log levels.
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
    public on(): this {
        this._on = true;
        return this;
    }

    /**
     * Turn this logger off. If already off, nothing happens.
     *
     * @returns the receiver logger.
     */
    public off(): this {
        this._on = false;
        return this;
    }

    /**
     * Log a message as an error, if the level allows it and the logger is on.
     *
     * @param msg - The message to print.
     * @param style - A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public error(msg: string, style?: string): this {
        this.print(msg, style, LogLevel.Error);
        return this;
    }

    /**
     * Log a message as an warning, if the level allows it and the logger is on.
     *
     * @param msg - The message to print.
     * @param style - A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public warn(msg: string, style?: string): this {
        this.print(msg, style, LogLevel.Warn);
        return this;
    }

    /**
     * Log a message as information, if the level allows it and the logger is on.
     *
     * @param msg - The message to print.
     * @param style - A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public info(msg: string, style?: string): this {
        this.print(msg, style, LogLevel.Info);
        return this;
    }

    /**
     * Log a message as debug information, if the level allows it and the logger is on.
     *
     * @param msg - The message to print.
     * @param style - A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public debug(msg: string, style?: string): this {
        this.print(msg, style, LogLevel.Debug);
        return this;
    }

    /**
     * Log a message regardless of the active level, but only if the logger is on.
     *
     * @param msg - The message to print.
     * @param style - A style on which to print the message
     *
     * @returns the receiver logger.
     */
    public log(msg: string, style?: string): this {
        this.print(msg, style);
        return this;
    }

    /**
     * Print the given message in the terminal, if the log level allows it and the logger is on.
     *
     * @param msg - The message to print
     * @param style - The style to use for printing.
     * @param actualLevel - The actual level on which the message should be printed.
     */
    private print(msg: string, style?: string, actualLevel?: LogLevel): void {
        if (this._on && (!actualLevel || this.isLevelGeqThan(actualLevel, this.level))) {
            if (style) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                msg = chalk[style](msg);
            }

            // eslint-disable-next-line no-console
            console.log(msg);
        }
    }

    /**
     * Answers if the first level is greater or equal than the second one.
     *
     * @param level1 - The first level to compare
     * @param level2 - The second level to compare.
     *
     * @returns `true` if the first level is greater or equal than the second, `false` otherwise.
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
 */
export const logger = new Logger(LogLevel.Error);
