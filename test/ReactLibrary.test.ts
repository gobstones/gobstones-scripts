/**
 * @author Alan Rodas Bonjour <alanrodas@gmail.com>
 */

import { testProjectCreation, testCommonProjectActions } from './CommonTests';

testProjectCreation('ReactLibrary', 'react-library-test-project');
testCommonProjectActions('ReactLibrary', 'react-library-test-project', ['dev']);
