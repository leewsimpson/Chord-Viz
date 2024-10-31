import { chordTypes, notePositions } from './constants.js';

export function parseChord(chordName) {
    const originalChordName = chordName;
    chordName = chordName.toUpperCase();
    
    const match = chordName.match(/^([A-G][#B]?)([^/]*)(?:\/([A-G][#B]?))?$/);
    if (!match) return null;

    let [_, root, type, bassNote] = match;
    root = root.replace('B', 'b');
    if (bassNote) bassNote = bassNote.replace('B', 'b');
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
        chordName: originalChordName,
        root,
        type,
        bassNote,
        chordNotes,
        bassNote: bassNoteValue
    });

    return {
        chordName: originalChordName,
        root,
        type,
        bassNote,
        chordNotes,
        bassNote: bassNoteValue
    };
}

