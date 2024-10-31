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
    '5': [0, 7]              // Power chord
};

export const whiteKeyIndices = [0, 2, 4, 5, 7, 9, 11];
export const blackKeyIndices = [1, 3, 6, 8, 10];
