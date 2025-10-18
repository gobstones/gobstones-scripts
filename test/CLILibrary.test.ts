/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { testProjectCreation, testCommonProjectActions } from './CommonTests';

testProjectCreation('CLILibrary', 'cli-library-test-project');
testCommonProjectActions('CLILibrary', 'cli-library-test-project');
