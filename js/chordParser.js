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

    // Ensure the root note is included in the chord notes
    const chordNotes = [notePositions[root]];
    // Convert type to lowercase for matching with chordTypes
    const lowerType = type.toLowerCase();
    if (!(lowerType in chordTypes)) return null;
    
    if (bassNote && !(bassNote in notePositions)) return null;

    const baseNote = notePositions[root];
    let chordNotes = chordTypes[lowerType].map(interval => (baseNote + interval) % 12);

    if (bassNote) {
        const bassNoteValue = notePositions[bassNote] % 12;
        
        // Check if the bass note is in the chord
        const bassNoteInChord = chordNotes.includes(bassNoteValue);
        
        if (bassNoteInChord) {
            // Reorder the notes to start with the bass note (like an inversion)
            chordNotes = chordNotes.filter(note => note !== bassNoteValue);
            chordNotes.unshift(bassNoteValue);
        } else {
            // Add the bass note to the chord
            chordNotes.unshift(bassNoteValue);
        }

        // Adjust octaves
        let currentOctave = 4; // Start from middle C (C4)
        chordNotes = chordNotes.map((note, index) => {
            if (index > 0 && note <= chordNotes[index - 1]) {
                currentOctave++;
            }
            return note + currentOctave * 12;
        });

        return {
            chordNotes,
            bassNote: chordNotes[0]
        };
    }

    // Adjust octaves for chords without bass note
    let currentOctave = 4; // Start from middle C (C4)
    chordNotes = chordNotes.map((note, index) => {
        if (index > 0 && note <= chordNotes[index - 1]) {
            currentOctave++;
        }
        return note + currentOctave * 12;
    });


    // Debug output
    console.log('Parsed chord:', {
        chordName,
        root,
        type: lowerType,
        bassNote,
        result: { chordNotes, bassNote: bassNote ? chordNotes[0] : null }
    });

    return {
        chordNotes,
        bassNote: null
    };

}

