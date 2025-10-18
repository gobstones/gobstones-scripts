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

export const dataProps = <TProps>(props: TProps): Partial<TProps> => propsMatching(props, /^data-/);

export const ariaProps = <TProps>(props: TProps): Partial<TProps> => propsMatching(props, /^aria-/);

const propsMatching = <TProps>(props: TProps, matcher: RegExp): Partial<TProps> => {
    const matchedProps: Partial<TProps> = {};
    for (const key in props) {
        if (matcher.test(key)) {
            matchedProps[key] = props[key];
        }
    }
    return matchedProps;
};
