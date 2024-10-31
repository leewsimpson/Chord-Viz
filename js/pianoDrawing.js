import { whiteKeyIndices, blackKeyIndices } from './constants.js';

export function createChordCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 120;
    return canvas;
}

export function drawPiano(ctx) {
    const whiteKeyWidth = 22;
    const whiteKeyHeight = 100;
    const blackKeyWidth = 14;
    const blackKeyHeight = 65;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw white keys only
    for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        ctx.rect(i * whiteKeyWidth, 0, whiteKeyWidth, whiteKeyHeight);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

function getWhiteKeyIndex(note) {
    const noteValue = note % 12;
    let index = 0;
    for (let i = 0; i < whiteKeyIndices.length; i++) {
        if (whiteKeyIndices[i] === noteValue) {
            return i;
        }
        if (whiteKeyIndices[i] > noteValue) {
            return i - 1;
        }
    }
    return whiteKeyIndices.length - 1;
}

export function highlightKeys(ctx, { chordNotes, bassNote }) {
    const whiteKeyWidth = 22;
    const whiteKeyHeight = 100;
    const blackKeyWidth = 14;
    const blackKeyHeight = 65;

    // Colors for different note types
    const chordColor = '#4A90E2';     // Light blue for chord notes
    const bassColor = '#E67E22';      // Orange for bass note
    const darkChordColor = '#2C5282'; // Dark blue for black chord notes
    const darkBassColor = '#A04000';  // Dark orange for black bass notes

    // First draw all white keys
    // 1. Draw white chord notes
    chordNotes.forEach(note => {
        const noteValue = note % 12;
        if (whiteKeyIndices.includes(noteValue)) {
            const whiteKeyIndex = getWhiteKeyIndex(note);
            const octave = Math.floor(note / 12);
            const whiteX = (whiteKeyIndex + octave * 7) * whiteKeyWidth;
            ctx.beginPath();
            ctx.rect(whiteX, 0, whiteKeyWidth, whiteKeyHeight);
            ctx.fillStyle = chordColor;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
    });

    // 2. Draw white bass note
    if (bassNote !== null && whiteKeyIndices.includes(bassNote % 12)) {
        const whiteKeyIndex = getWhiteKeyIndex(bassNote);
        const octave = Math.floor(bassNote / 12);
        const whiteX = (whiteKeyIndex + octave * 7) * whiteKeyWidth;
        ctx.beginPath();
        ctx.rect(whiteX, 0, whiteKeyWidth, whiteKeyHeight);
        ctx.fillStyle = bassColor;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }

    // Then draw all black keys on top
    const blackKeyPositions = [
        { x: 1, note: 1 },  // C#
        { x: 2, note: 3 },  // D#
        { x: 4, note: 6 },  // F#
        { x: 5, note: 8 },  // G#
        { x: 6, note: 10 }  // A#
    ];

    for (let octave = 0; octave < 2; octave++) {
        blackKeyPositions.forEach(pos => {
            const x = (pos.x + octave * 7) * whiteKeyWidth - blackKeyWidth/2;
            ctx.beginPath();
            ctx.rect(x, 0, blackKeyWidth, blackKeyHeight);
            
            const isChordNote = chordNotes.some(note => {
                const noteValue = note % 12;
                const noteOctave = Math.floor(note / 12);
                return noteValue === pos.note && noteOctave === octave;
            });

            const isBassNote = bassNote !== null && 
                (bassNote % 12 === pos.note) && 
                (Math.floor(bassNote / 12) === octave);
            
            // If it's a bass note, use bass color, otherwise if it's a chord note use chord color
            if (isBassNote) {
                ctx.fillStyle = darkBassColor;
            } else if (isChordNote) {
                ctx.fillStyle = darkChordColor;
            } else {
                ctx.fillStyle = '#000';
            }
            ctx.fill();
        });
    }
}
