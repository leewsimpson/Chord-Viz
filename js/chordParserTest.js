import { parseChord } from './chordParser.js';

const testCases = [
    // Major chords
    { input: 'C', expected: { root: 'C', type: '', bassNote: null, chordNotes: [0, 4, 7] } },
    { input: 'G', expected: { root: 'G', type: '', bassNote: null, chordNotes: [7, 11, 14] } },

    // Minor chords
    { input: 'Am', expected: { root: 'A', type: 'm', bassNote: null, chordNotes: [9, 12, 16] } },
    { input: 'bm', expected: { root: 'B', type: 'm', bassNote: null, chordNotes: [11, 14, 17] } },

    // Seventh chords
    { input: 'C7', expected: { root: 'C', type: '7', bassNote: null, chordNotes: [0, 4, 7, 10] } },
    { input: 'a7', expected: { root: 'A', type: '7', bassNote: null, chordNotes: [9, 13, 16, 19] } },

    // Major 7th chords
    { input: 'CM7', expected: { root: 'C', type: 'M7', bassNote: null, chordNotes: [0, 4, 7, 11] } },
    { input: 'DM7', expected: { root: 'D', type: 'M7', bassNote: null, chordNotes: [2, 6, 9, 13] } },

    // Augmented chords
    { input: 'Caug', expected: { root: 'C', type: 'aug', bassNote: null, chordNotes: [0, 4, 8] } },
    { input: 'faug', expected: { root: 'F', type: 'aug', bassNote: null, chordNotes: [5, 9, 13] } },

    // Diminished chords
    { input: 'Bdim', expected: { root: 'B', type: 'dim', bassNote: null, chordNotes: [11, 14, 17] } },
    { input: 'c#dim', expected: { root: 'C#', type: 'dim', bassNote: null, chordNotes: [1, 4, 7] } },

    // Suspended chords
    { input: 'Gsus4', expected: { root: 'G', type: 'sus4', bassNote: null, chordNotes: [7, 12, 14] } },
    { input: 'Asus2', expected: { root: 'A', type: 'sus2', bassNote: null, chordNotes: [9, 11, 16] } },

    // Sixth chords
    { input: 'C6', expected: { root: 'C', type: '6', bassNote: null, chordNotes: [0, 4, 7, 9] } },
    { input: 'E6', expected: { root: 'E', type: '6', bassNote: null, chordNotes: [4, 8, 11, 13] } },

    // Ninth chords
    { input: 'C9', expected: { root: 'C', type: '9', bassNote: null, chordNotes: [0, 4, 7, 10, 14] } },
    { input: 'D9', expected: { root: 'D', type: '9', bassNote: null, chordNotes: [2, 6, 9, 12, 16] } },

    // Eleventh chords
    { input: 'C11', expected: { root: 'C', type: '11', bassNote: null, chordNotes: [0, 4, 7, 10, 14, 17] } },
    { input: 'G11', expected: { root: 'G', type: '11', bassNote: null, chordNotes: [7, 11, 14, 17, 21, 24] } },

    // Thirteenth chords
    { input: 'C13', expected: { root: 'C', type: '13', bassNote: null, chordNotes: [0, 4, 7, 10, 14, 17, 21] } },
    { input: 'A13', expected: { root: 'A', type: '13', bassNote: null, chordNotes: [9, 13, 16, 19, 23, 26, 30] } },

    // Add9 chords
    { input: 'Cadd9', expected: { root: 'C', type: 'add9', bassNote: null, chordNotes: [0, 4, 7, 14] } },
    { input: 'Fadd9', expected: { root: 'F', type: 'add9', bassNote: null, chordNotes: [5, 9, 12, 19] } },

    // Chords with sharps and flats
    { input: 'F#', expected: { root: 'F#', type: '', bassNote: null, chordNotes: [6, 10, 13] } },
    { input: 'Bb', expected: { root: 'Bb', type: '', bassNote: null, chordNotes: [10, 14, 17] } },

    // Slash chords with inversions
    { input: 'C/E', expected: { root: 'C', type: '', bassNote: null, chordNotes: [4, 7, 12] } }, // First inversion of C major
    { input: 'G/B', expected: { root: 'G', type: '', bassNote: null, chordNotes: [11, 14, 19] } }, // First inversion of G major
    { input: 'D/F#', expected: { root: 'D', type: '', bassNote: null, chordNotes: [6, 9, 14] } }, // First inversion of D major

    // Slash chords with bass notes not in the chord
    { input: 'C/G', expected: { root: 'C', type: '', bassNote: 'G', chordNotes: [7, 0, 4] } }, // G as the lowest note
    { input: 'Am/F', expected: { root: 'A', type: 'm', bassNote: 'F', chordNotes: [5, 9, 12, 16] } }, // F as the lowest note
    { input: 'D/B', expected: { root: 'D', type: '', bassNote: 'B', chordNotes: [11, 2, 6, 9] } }, // B as the lowest note
    { input: 'G/E', expected: { root: 'G', type: '', bassNote: 'E', chordNotes: [4, 7, 11, 14] } }, // E as the lowest note
    { input: 'F/C', expected: { root: 'F', type: '', bassNote: 'C', chordNotes: [0, 5, 9] } }, // C as the lowest note

    // Invalid chord
    { input: 'Xyz', expected: null }
];

function runTests() {
    let passedTests = 0;
    let failedTests = 0;

    testCases.forEach((testCase, index) => {
        const result = parseChord(testCase.input);
        const expected = testCase.expected;

        let passed = true;
        let errorMessage = '';

        if (expected === null) {
            if (result !== null) {
                passed = false;
                errorMessage = `Expected null, but got ${JSON.stringify(result)}`;
            }
        } else if (!result) {
            passed = false;
            errorMessage = 'Parsing failed (returned null)';
        } else {
            // Check all properties
            const properties = ['root', 'type', 'bassNote', 'chordNotes'];
            properties.forEach(prop => {
                if (prop === 'chordNotes') {
                    const expectedNotes = expected[prop]; // .map(note => note % 12);
                    const resultNotes = result[prop].map(note => ((note % 12) + 12) % 12); // Handle negative notes
                    if (!arraysEqual(expectedNotes, resultNotes)) {
                        passed = false;
                        errorMessage += `${prop} mismatch. Expected: [${expectedNotes}], Got: [${resultNotes}]\n`;
                    }
                } else if (result[prop] !== expected[prop]) {
                    passed = false;
                    errorMessage += `${prop} mismatch. Expected: ${expected[prop]}, Got: ${result[prop]}\n`;
                }
            });
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

// Run tests
runTests();
