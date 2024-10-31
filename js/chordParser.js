import { chordTypes, notePositions } from './constants.js';

export function parseChord(chordName) {
    const match = chordName.match(/^([A-G][#b]?)([^/]*)(?:\/([A-G][#b]?))?$/);
    if (!match) return null;

    let [_, root, type, bassNote] = match;
    if (!(root in notePositions)) return null;

    console.log('Parsed chord components:', { root, type, bassNote });

    type = type.toLowerCase();
    if (!(type in chordTypes)) {
        type = '';
    }

    const baseNote = notePositions[root];
    let chordNotes = chordTypes[type].map(interval => (baseNote + interval) % 12);

    let bassNoteValue = null;
    if (bassNote) {
        bassNoteValue = notePositions[bassNote];
        if (!chordNotes.includes(bassNoteValue)) {
            chordNotes.push(bassNoteValue);
        }
    }

    console.log('Parsed chord:', {
        chordName,
        root,
        type,
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

