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
import { run, npx } from '../_/utilities';

type CommitMessageSource = 'commit' | 'squash' | 'merge' | 'template' | 'message';

export default (commitMessageFile: string, commitSource?: CommitMessageSource, sha1?: string) => {
    console.log('Function called successfully');
    if (
        isAmend(commitSource, sha1) ||
        commitSource === 'squash' ||
        commitSource === 'merge'
    ) {
        return 0;
    }
    if (commitSource === 'message') {
        console.log('Setting a message through -m or -F option in this project ' +
            'has been disabled. Please run a simple commit.\n'
        );
        return 1;
    }
    if (commitSource === 'template') {
        console.log('Setting a template through -t or commit.template in this project ' +
            'has been disabled. Please run a simple commit.\n'
        );
        return 1;
    }
    return npx('cz', '--hook');
}

function isAmend(commitSource?: CommitMessageSource, sha1?: string) {
    return commitSource === 'commit' && sha1;
}
