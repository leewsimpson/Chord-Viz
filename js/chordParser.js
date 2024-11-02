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
    const intervals = chordTypes[type];
    if (intervals === undefined) {
        console.warn(`Unknown chord type: ${type}`);
        return null;
    }

    // Calculate chord notes based on root
    let chordNotes = intervals.map(interval => rootValue + interval);

    // If there is a bass note, include it as the lowest note
    if (bassNote) {
        const bassValue = notePositions[bassNote];
        if (!chordNotes.includes(bassValue)) {
            chordNotes.push(bassValue);
        }

        // Adjust chord notes to be at or above the bass note
        chordNotes = chordNotes.map(note => {
            while (note < bassValue) {
                note += 12;
            }
            // Keep notes within one octave above the bass note
            while (note >= bassValue + 12) {
                note -= 12;
            }
            return note;
        });
    }

    // Remove duplicate notes
    chordNotes = Array.from(new Set(chordNotes));

    // Sort the chord notes in ascending order
    chordNotes.sort((a, b) => a - b);

    return {
        chordName,
        root,
        type,
        bassNote,
        chordNotes
    };
}

function normalizeNote(note) {
    return note.charAt(0).toUpperCase() + note.slice(1).toLowerCase();
}

function normalizeType(type) {
    type = type.toLowerCase();
    if (type === 'maj7' || type === 'm7') return type;
    if (['7', 'dim', 'aug', 'sus4', 'sus2', '5'].includes(type)) return type;
    if (['9', '11', '13', 'add9'].includes(type)) return type;
    if (type === 'm') return type;
    if (type === 'M7') return 'maj7';
    if (type === '6') return type;
    return '';
}
