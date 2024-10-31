import { parseChord } from './chordParser.js';
import { notePositions } from './constants.js';

const testCases = [
    { input: 'C', expected: { root: 'C', type: '', bassNote: null, chordNotes: [0, 4, 7] } },
    { input: 'c', expected: { root: 'C', type: '', bassNote: null, chordNotes: [0, 4, 7] } },
    { input: 'Cm', expected: { root: 'C', type: 'm', bassNote: null, chordNotes: [0, 3, 7] } },
    { input: 'C#', expected: { root: 'C#', type: '', bassNote: null, chordNotes: [0, 4, 7] } },
    { input: 'Db', expected: { root: 'Db', type: '', bassNote: null, chordNotes: [0, 4, 7] } },
    { input: 'Cmaj7', expected: { root: 'C', type: 'maj7', bassNote: null, chordNotes: [0, 4, 7, 11] } },
    { input: 'C7', expected: { root: 'C', type: '7', bassNote: null, chordNotes: [0, 4, 7, 10] } },
    { input: 'Csus4', expected: { root: 'C', type: 'sus4', bassNote: null, chordNotes: [0, 5, 7] } },
    { input: 'C#m7b5', expected: { root: 'C#', type: 'm7b5', bassNote: null, chordNotes: [0, 3, 6, 10] } },
    { input: 'Caug', expected: { root: 'C', type: 'aug', bassNote: null, chordNotes: [0, 4, 8] } },
    { input: 'Cdim', expected: { root: 'C', type: 'dim', bassNote: null, chordNotes: [0, 3, 6] } },
    { input: 'C6', expected: { root: 'C', type: '6', bassNote: null, chordNotes: [0, 4, 7, 9] } },
    { input: 'Cm6', expected: { root: 'C', type: 'm6', bassNote: null, chordNotes: [0, 3, 7, 9] } },
    { input: 'C9', expected: { root: 'C', type: '9', bassNote: null, chordNotes: [0, 4, 7, 10, 2] } },
    { input: 'Cm9', expected: { root: 'C', type: 'm9', bassNote: null, chordNotes: [0, 3, 7, 10, 2] } },
    { input: 'C11', expected: { root: 'C', type: '11', bassNote: null, chordNotes: [0, 4, 7, 10, 2, 5] } },
    { input: 'C13', expected: { root: 'C', type: '13', bassNote: null, chordNotes: [0, 4, 7, 10, 2, 5, 9] } },
    { input: 'Cadd9', expected: { root: 'C', type: 'add9', bassNote: null, chordNotes: [0, 4, 7, 2] } },
    { input: 'C/E', expected: { root: 'C', type: '', bassNote: 'E', chordNotes: [4, 7, 12] } },
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
            // Check root note
            if (result.root !== expected.root) {
                passed = false;
                errorMessage += `Root note mismatch. Expected: ${expected.root}, Got: ${result.root}\n`;
            }

            // Check chord notes
            if (expected.chordNotes) {
                const expectedNotes = expected.chordNotes.map(note => note % 12);
                const resultNotes = result.chordNotes.map(note => ((note % 12) + 12) % 12); // Handle negative notes
                if (!arraysEqual(expectedNotes, resultNotes)) {
                    passed = false;
                    errorMessage += `Chord notes mismatch. Expected: [${expectedNotes}], Got: [${resultNotes}]\n`;
                }
            }

            // Check bass note
            if (expected.bassNote) {
                if (result.bassNote !== expected.bassNote) {
                    passed = false;
                    errorMessage += `Bass note mismatch. Expected: ${expected.bassNote}, Got: ${result.bassNote}\n`;
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

// Helper function to compare arrays
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    a = a.slice().sort();
    b = b.slice().sort();
    return a.every((val, index) => val === b[index]);
}


runTests();
