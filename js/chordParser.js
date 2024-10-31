import { chordTypes, notePositions } from './constants.js';

/**
 * Parses a chord name and returns its components and notes.
 * 
 * @param {string} chordName - The chord name to parse (e.g., 'C', 'Cm', 'C#maj7', 'Db/F')
 * @returns {Object|null} An object containing the parsed chord information, or null if parsing fails
 * @property {string} chordName - The original chord name input
 * @property {string} root - The root note of the chord (e.g., 'C', 'C#', 'Db')
 * @property {string} type - The chord type (e.g., '', 'm', 'maj7', '7', 'sus4', 'aug', 'dim')
 * @property {string|null} bassNote - The bass note if specified, or null
 * @property {number[]} chordNotes - Array of MIDI note numbers representing the chord notes
 * @property {number|null} bassNoteValue - MIDI note number of the bass note, or null if not specified
 * 
 * Requirements:
 * - Supports major, minor, 7th, major 7th, sus4, augmented, diminished, 6th, 9th, 11th, 13th, and add9 chords
 * - Handles both uppercase and lowercase input
 * - Recognizes both sharp (#) and flat (b) notations
 * - Supports slash chords (e.g., C/E)
 *   - Reorders the chord if the bass note is in the chord
 *   - shows a lower octave bass note if the bass note is not in the chord
 * - Returns null for invalid chord names
 * - Chord notes are represented as MIDI note numbers (0-11, where 0 is C)
 */
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
        if (bassNoteValue === undefined) {
            // Handle flat bass notes
            bassNote = bassNote.replace('b', '');
            bassNoteValue = (notePositions[bassNote] - 1 + 12) % 12;
        }
        
        // If the bass note is not in the chord, add it as the first note
        if (!chordNotes.includes(bassNoteValue)) {
            chordNotes.unshift(bassNoteValue);
        } else {
            // If the bass note is in the chord, move it to the first position
            chordNotes = [
                bassNoteValue,
                ...chordNotes.filter(note => note !== bassNoteValue)
            ];
        }
    }

    console.log('Parsed chord:', {
        chordName: originalChordName,
        root,
        type,
        bassNote: bassNote || null,
        chordNotes,
        bassNoteValue
    });

    return {
        chordName: originalChordName,
        root,
        type,
        bassNote: bassNote || null,
        chordNotes,
        bassNoteValue
    };
}

