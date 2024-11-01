export const notePositions = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11
};

export const chordTypes = {
    '': [0, 4, 7],           // Major
    'm': [0, 3, 7],          // Minor
    'dim': [0, 3, 6],        // Diminished
    'aug': [0, 4, 8],        // Augmented
    '7': [0, 4, 7, 10],      // Dominant 7th
    'maj7': [0, 4, 7, 11],   // Major 7th
    'm7': [0, 3, 7, 10],     // Minor 7th
    'dim7': [0, 3, 6, 9],    // Diminished 7th
    '5': [0, 7],             // Power chord
    'sus4': [0, 5, 7],       // Suspended 4th
    'sus2': [0, 2, 7],       // Suspended 2th
    'm7b5': [0, 3, 6, 10],   // Half-diminished 7th
    '6': [0, 4, 7, 9],       // Major 6th
    'm6': [0, 3, 7, 9],      // Minor 6th
    '9': [0, 4, 7, 10, 14],   // Dominant 9th
    'm9': [0, 3, 7, 10, 14],  // Minor 9th
    '11': [0, 4, 7, 10, 14, 17], // 11th
    '13': [0, 4, 7, 10, 14, 17, 21], // 13th
    'add9': [0, 2, 4, 7]     // Add 9
};

export const whiteKeyIndices = [0, 2, 4, 5, 7, 9, 11];
export const blackKeyIndices = [1, 3, 6, 8, 10];

export const enharmonicEquivalents = {
    'C#': 'Db',
    'Db': 'C#',
    'D#': 'Eb',
    'Eb': 'D#',
    'F#': 'Gb',
    'Gb': 'F#',
    'G#': 'Ab',
    'Ab': 'G#',
    'A#': 'Bb',
    'Bb': 'A#'
};
