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

    // Draw white keys
    for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        ctx.rect(i * whiteKeyWidth, 0, whiteKeyWidth, whiteKeyHeight);
        ctx.strokeStyle = '#000';
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    // Draw black keys
    const blackKeyPositions = [1, 2, 4, 5, 6];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < blackKeyPositions.length; j++) {
            const x = (blackKeyPositions[j] + i * 7) * whiteKeyWidth - blackKeyWidth / 2;
            ctx.beginPath();
            ctx.rect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.fillStyle = '#000';
            ctx.fill();
        }
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
    drawPiano(ctx);  // Draw the piano background first
    const whiteKeyWidth = 22;
    const whiteKeyHeight = 100;
    const blackKeyWidth = 14;
    const blackKeyHeight = 65;

    // Colors for different note types
    const chordColor = '#4A90E2';     // Light blue for chord notes
    const bassColor = '#E67E22';      // Orange for bass note
    const darkChordColor = '#2C5282'; // Dark blue for black chord notes
    const darkBassColor = '#A04000';  // Dark orange for black bass notes

    // Highlight white keys first
    chordNotes.forEach(note => {
        const noteValue = ((note % 12) + 12) % 12;  // Ensure positive value
        const octave = Math.floor(note / 12);

        if (whiteKeyIndices.includes(noteValue)) {
            const whiteKeyIndex = getWhiteKeyIndex(noteValue);
            const whiteX = (whiteKeyIndex + octave * 7) * whiteKeyWidth;
            ctx.beginPath();
            ctx.rect(whiteX, 0, whiteKeyWidth, whiteKeyHeight);
            ctx.fillStyle = note === bassNote ? bassColor : chordColor;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // Draw black keys
    const blackKeyPositions = [1, 2, 4, 5, 6];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < blackKeyPositions.length; j++) {
            const x = (blackKeyPositions[j] + i * 7) * whiteKeyWidth - blackKeyWidth / 2;
            ctx.beginPath();
            ctx.rect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.fillStyle = '#000';
            ctx.fill();
        }
    }

    // Highlight black keys last
    chordNotes.forEach(note => {
        const noteValue = ((note % 12) + 12) % 12;  // Ensure positive value
        const octave = Math.floor(note / 12);

        if (!whiteKeyIndices.includes(noteValue)) {
            const blackKeyIndex = blackKeyIndices.indexOf(noteValue);
            const x = ((blackKeyIndex < 2 ? blackKeyIndex + 1 : blackKeyIndex + 2) + octave * 7) * whiteKeyWidth - blackKeyWidth/2;
            ctx.beginPath();
            ctx.rect(x, 0, blackKeyWidth, blackKeyHeight);
            ctx.fillStyle = note === bassNote ? darkBassColor : darkChordColor;
            ctx.fill();
        }
    });
}
