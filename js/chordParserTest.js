import { parseChord } from './chordParser.js';
import { notePositions } from './constants.js';

const testCases = [
    { input: 'C', expected: { root: 'C', type: '', bassNote: null } },
    { input: 'Cm', expected: { root: 'C', type: 'm', bassNote: null } },
    { input: 'C#', expected: { root: 'C#', type: '', bassNote: null } },
    { input: 'Db', expected: { root: 'Db', type: '', bassNote: null } },
    { input: 'Cmaj7', expected: { root: 'C', type: 'maj7', bassNote: null } },
    { input: 'C7', expected: { root: 'C', type: '7', bassNote: null } },
    { input: 'Csus4', expected: { root: 'C', type: 'sus4', bassNote: null } },
    { input: 'C/G', expected: { root: 'C', type: '', bassNote: 'G' } },
    { input: 'Cm7/Bb', expected: { root: 'C', type: 'm7', bassNote: 'Bb' } },
    { input: 'C#m7b5', expected: { root: 'C#', type: 'm7b5', bassNote: null } },
    { input: 'Caug', expected: { root: 'C', type: 'aug', bassNote: null } },
    { input: 'Cdim', expected: { root: 'C', type: 'dim', bassNote: null } },
    { input: 'C6', expected: { root: 'C', type: '6', bassNote: null } },
    { input: 'Cm6', expected: { root: 'C', type: 'm6', bassNote: null } },
    { input: 'C9', expected: { root: 'C', type: '9', bassNote: null } },
    { input: 'Cm9', expected: { root: 'C', type: 'm9', bassNote: null } },
    { input: 'C11', expected: { root: 'C', type: '11', bassNote: null } },
    { input: 'C13', expected: { root: 'C', type: '13', bassNote: null } },
    { input: 'Cadd9', expected: { root: 'C', type: 'add9', bassNote: null } },
    { input: 'C/E', expected: { root: 'C', type: '', bassNote: 'E' } },
];

function runTests() {
    let passedTests = 0;
    let failedTests = 0;

    testCases.forEach((testCase, index) => {
        const result = parseChord(testCase.input);
        const expected = testCase.expected;

        let passed = true;
        let errorMessage = '';

        if (!result) {
            passed = false;
            errorMessage = 'Parsing failed (returned null)';
        } else {
            const rootNote = result.chordNotes[0] % 12;
            const expectedRootNote = expected.root in notePositions ? notePositions[expected.root] : null;

            if (rootNote !== expectedRootNote) {
                passed = false;
                errorMessage += `Root note mismatch. Expected: ${expected.root}, Got: ${Object.keys(notePositions).find(key => notePositions[key] === rootNote)}\n`;
            }

            if (expected.bassNote) {
                const expectedBassNote = notePositions[expected.bassNote];
                if (result.bassNote % 12 !== expectedBassNote) {
                    passed = false;
                    errorMessage += `Bass note mismatch. Expected: ${expected.bassNote}, Got: ${Object.keys(notePositions).find(key => notePositions[key] === (result.bassNote % 12))}\n`;
                }
            } else if (result.bassNote !== null) {
                passed = false;
                errorMessage += `Unexpected bass note. Expected: null, Got: ${result.bassNote}\n`;
            }
        }

        if (passed) {
            console.log(`Test ${index + 1} (${testCase.input}) passed`);
            passedTests++;
        } else {
            console.log(`Test ${index + 1} (${testCase.input}) failed:`);
            console.log(errorMessage);
            failedTests++;
        }
    });

    console.log(`\nTest Summary:`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Total: ${testCases.length}`);
}

runTests();
