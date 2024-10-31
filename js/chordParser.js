import { notePositions } from './constants.js';

const chordTypes = {
    '': [0, 4, 7],
    'm': [0, 3, 7],
    'dim': [0, 3, 6],
    'aug': [0, 4, 8],
    '7': [0, 4, 7, 10],
    'M7': [0, 4, 7, 11],
    'maj7': [0, 4, 7, 11],
    'm7': [0, 3, 7, 10],
    'm7b5': [0, 3, 6, 10],
    'ø': [0, 3, 6, 10],
    'sus4': [0, 5, 7],
    'sus2': [0, 2, 7],
    '6': [0, 4, 7, 9],
    'm6': [0, 3, 7, 9],
    '9': [0, 4, 7, 10, 14],
    'm9': [0, 3, 7, 10, 14],
    '11': [0, 4, 7, 10, 14, 17],
    '13': [0, 4, 7, 10, 14, 17, 21],
    'add9': [0, 4, 7, 14]
};

/**
 * Parses a chord name and returns its components and notes.
 * 
 * @param {string} chordName - The chord name to parse (e.g., 'C', 'Cm', 'C#maj7', 'Db/F')
 * @returns {Object|null} An object containing the parsed chord information, or null if parsing fails
 * @property {string} chordName - The original chord name input
 * @property {string} root - The root note of the chord (e.g., 'C', 'C#', 'Db')
 * @property {string} type - The chord type (e.g., '', 'm', 'maj7', '7', 'sus4', 'aug', 'dim')
 * @property {string|null} bassNote - The bass note if specified, or null
 * @property {number[]} chordNotes - Array of MIDI note numbers representing the chord notes. starts from 0 and can span multiple octaves
 * @property {number|null} bassNoteValue - MIDI note number of the bass note, or null if not specified
 * 
 * Requirements:
 * - Supports major, minor, 7th, major 7th, sus4, augmented, diminished, 6th, 9th, 11th, 13th, and add9 chords
 * - Handles both uppercase and lowercase input
 * - Recognizes both sharp (#) and flat (b) notations
 * - Supports slash chords (e.g., C/E)
 *   - Reorders the chord if the bass note is in the chord
 *   - Shows a lower octave bass note if the bass note is not in the chord
 * - Returns null for invalid chord names
 * - Chord notes are represented as MIDI note numbers (0-11, where 0 is C)
 */
export function parseChord(chordName) {
    const originalChordName = chordName;
    chordName = chordName.trim();

    const regex = /^([A-Ga-g](?:#|b)?)(.*?)(?:\/([A-Ga-g](?:#|b)?))?$/;
    const match = chordName.match(regex);
    if (!match) return null;

    let [_, root, type, bassNote] = match;

    root = root.charAt(0).toUpperCase() + root.slice(1).toLowerCase();
    type = type.toLowerCase();
    if (bassNote) {
        bassNote = bassNote.charAt(0).toUpperCase() + bassNote.slice(1).toLowerCase();
    }

    if (!(root in notePositions)) {
        return null;
    }

    if (!(type in chordTypes)) {
        // Special case for 'M7' which might be interpreted as 'm7'
        if (type.toUpperCase() === 'M7' || type.toLowerCase() === 'maj7') {
            type = 'M7';
        } else {
            type = '';
        }
    }

    const baseNote = notePositions[root];
    const intervals = chordTypes[type];

    let chordNotes = intervals.map(interval => {
        let note = (baseNote + interval) % 12;
        if (note < baseNote) note += 12;
        return note;
    });

    // Ensure the chord spans no more than two octaves
    for (let i = 1; i < chordNotes.length; i++) {
        while (chordNotes[i] < chordNotes[i-1]) {
            chordNotes[i] += 12;
        }
    }

    // If the highest note is more than two octaves above the lowest, adjust
    while (chordNotes[chordNotes.length - 1] - chordNotes[0] > 24) {
        for (let i = 1; i < chordNotes.length; i++) {
            chordNotes[i] -= 12;
        }
    }

    let bassNoteValue = null;

    if (bassNote) {
        if (!(bassNote in notePositions)) {
            return null;
        }

        bassNoteValue = notePositions[bassNote];

        // Find the octave for the bass note
        let bassNoteOctave = 0;
        while (bassNoteValue + bassNoteOctave * 12 < chordNotes[0]) {
            bassNoteOctave++;
        }
        bassNoteValue += bassNoteOctave * 12;

        // If the bass note is already in the chord, remove it from its current position
        const bassNoteIndex = chordNotes.indexOf(bassNoteValue);
        if (bassNoteIndex !== -1) {
            chordNotes.splice(bassNoteIndex, 1);
        }

        // Add the bass note to the beginning of the chord
        chordNotes.unshift(bassNoteValue);
    }

    return {
        chordName: originalChordName,
        root,
        type,
        bassNote: bassNote || null,
        chordNotes,
        bassNoteValue
    };
}
