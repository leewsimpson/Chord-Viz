import { chordTypes } from './constants.js';

export const notePositions = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

export function parseChord(chordName) {
    // Convert the input to uppercase for case-insensitive matching
    const upperChordName = chordName.toUpperCase();
    
    // Match pattern like "C#M7/G" - captures root, type, and optional bass note
    const match = upperChordName.match(/^([A-G][#B]?)([^/]*)(?:\/([A-G][#B]?))?$/);
    if (!match) return null;

    const [_, root, type, bassNote] = match;
    if (!(root in notePositions)) return null;
    
    // Debug: Log the parsed chord components
    console.log('Parsed chord components:', { root, type, bassNote });

    // Convert type to lowercase for matching with chordTypes
    let lowerType = type.toLowerCase();
    if (!(lowerType in chordTypes)) {
        // If the chord type is not recognized, default to a major chord
        lowerType = '';
    }
    
    const baseNote = notePositions[root];
    let chordNotes = chordTypes[lowerType].map(interval => (baseNote + interval) % 12);

    // Adjust octaves for chord notes
    let currentOctave = 4; // Start from middle C (C4)
    chordNotes = chordNotes.map((note, index) => {
        if (index > 0 && note <= chordNotes[index - 1]) {
            currentOctave++;
        }
        return note + currentOctave * 12;
    });

    let bassNoteValue = null;
    if (bassNote) {
        bassNoteValue = notePositions[bassNote] + 48; // Add bass note an octave lower
        // Remove any existing instances of the bass note
        chordNotes = chordNotes.filter(note => note % 12 !== bassNoteValue % 12);
        // Add the bass note to the front
        chordNotes.unshift(bassNoteValue);
    }

    // Debug output
    console.log('Parsed chord:', {
        chordName,
        root,
        type: lowerType,
        bassNote,
        result: { 
            chordNotes, 
            bassNote: bassNoteValue,
        }
    });

    return {
        chordNotes,
        bassNote: bassNoteValue
    };
}

