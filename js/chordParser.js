import { notePositions, chordTypes } from './constants.js';

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
        const bassNoteIndex = chordNotes.findIndex(note => note % 12 === bassNoteValue % 12);
        if (bassNoteIndex !== -1) {
            // If bass note is in the chord, move it to the front
            const bassNoteOctave = Math.floor(chordNotes[bassNoteIndex] / 12);
            chordNotes.splice(bassNoteIndex, 1);
            chordNotes.unshift(bassNoteValue + (bassNoteOctave - 4) * 12);
        } else {
            // If bass note is not in the chord, add it to the front
            chordNotes.unshift(bassNoteValue);
        }
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

