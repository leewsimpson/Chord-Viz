import { notePositions, chordTypes } from './constants.js';

export function parseChord(chordName) {
    // Match pattern like "C#m7/G" - captures root, type, and optional bass note
    const match = chordName.match(/^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/);
    if (!match) return null;

    const [_, root, type, bassNote] = match;
    if (!(root in notePositions)) return null;
    if (!(type in chordTypes)) return null;
    if (bassNote && !(bassNote in notePositions)) return null;

    const baseNote = notePositions[root];
    let chordNotes = chordTypes[type].map(interval => baseNote + interval);

    if (bassNote) {
        const bassNoteValue = notePositions[bassNote];
        
        // Remove any instances of the bass note from the chord notes
        // (considering octave equivalence)
        chordNotes = chordNotes.filter(note => (note % 12) !== (bassNoteValue % 12));

        return {
            chordNotes,
            bassNote: bassNoteValue
        };
    }

    return {
        chordNotes,
        bassNote: null
    };
}
