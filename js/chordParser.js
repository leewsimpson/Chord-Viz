import { notePositions, chordTypes } from './constants.js';

/**
 * Parses a chord name and returns its components and notes.
 * 
 * @param {string} chordName - The chord name to parse (e.g., 'C', 'Cm', 'C#maj7', 'Db/F')
 * @returns {Object|null} An object containing the parsed chord information, or null if parsing fails
 */
export function parseChord(chordName) {
    const regex = /^([A-Ga-g][#b]?)([^/]*)(?:\/([A-Ga-g][#b]?))?$/i;
    const match = chordName.match(regex);
    if (!match) return null;

    let [, root, type, bassNote] = match;
    root = normalizeNote(root);
    type = normalizeType(type);
    bassNote = bassNote ? normalizeNote(bassNote) : null;

    if (!root || !(root in notePositions)) return null;

    const rootValue = notePositions[root];
    const intervals = chordTypes[type] || chordTypes[''];
    let chordNotes = intervals.map(interval => (rootValue + interval) % 12);

    let bassNoteValue = null;
    if (bassNote) {
        bassNoteValue = notePositions[bassNote];
        if (chordNotes.includes(bassNoteValue % 12)) {
            // Reorder chord if bass note is in the chord
            chordNotes = chordNotes.filter(note => note !== bassNoteValue % 12);
            chordNotes.unshift(bassNoteValue % 12);
        } else {
            // Add bass note if it's not in the chord
            chordNotes.unshift(bassNoteValue % 12);
        }
    }

    // Adjust notes to span multiple octaves if necessary
    for (let i = 1; i < chordNotes.length; i++) {
        while (chordNotes[i] <= chordNotes[i-1]) {
            chordNotes[i] += 12;
        }
    }

    return {
        chordName,
        root,
        type,
        bassNote,
        chordNotes,
        bassNoteValue
    };
}

function normalizeNote(note) {
    return note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
}

function normalizeType(type) {
    type = type.toLowerCase();
    if (type === 'maj7' || type === 'm7') return type;
    if (type === '7' || type === 'dim' || type === 'aug' || type === 'sus4' || type === 'sus2') return type;
    if (type === '9' || type === '11' || type === '13' || type === 'add9') return type;
    if (type === 'm') return type;
    return '';
}
