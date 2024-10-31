import { parseChord } from './chordParser.js';
import { createChordCanvas, drawPiano, highlightKeys } from './pianoDrawing.js';

function createChordVisualization(chordName, lyrics) {
    const container = document.createElement('div');
    container.className = 'chord-container';

    const nameElement = document.createElement('div');
    nameElement.className = 'chord-name';
    nameElement.textContent = chordName;
    container.appendChild(nameElement);

    const canvas = createChordCanvas();
    const ctx = canvas.getContext('2d');
    drawPiano(ctx);

    const parsedChord = parseChord(chordName);
    if (parsedChord) {
        highlightKeys(ctx, parsedChord);
    }

    container.appendChild(canvas);

    if (lyrics) {
        const lyricsElement = document.createElement('div');
        lyricsElement.className = 'lyrics';
        lyricsElement.textContent = lyrics;
        container.appendChild(lyricsElement);
    }

    return container;
}

function updateChordGrid() {
    const textarea = document.getElementById('chordInput');
    const chordGrid = document.getElementById('chordGrid');
    const currentInput = textarea.value;
    
    // Clear previous visualizations
    chordGrid.innerHTML = '';
    
    // Process all non-empty lines
    currentInput.split('\n').forEach(line => {
        if (line.trim()) {
            // First try to parse as a chord-lyrics pair
            const parts = line.split('-').map(part => part.trim());
            
            // If there's no dash or only one part, treat the whole line as a chord
            const chordName = parts[0];
            const lyrics = parts.length > 1 ? parts[1] : '';
            
            // Only create visualization if we can parse the chord
            if (chordName && parseChord(chordName)) {
                const visualization = createChordVisualization(chordName, lyrics);
                chordGrid.appendChild(visualization);
            }
        }
    });
}

// Debounce function to prevent too frequent updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('chordInput');
    
    // Handle input changes with minimal debounce
    const debouncedUpdate = debounce(updateChordGrid, 50);
    textarea.addEventListener('input', debouncedUpdate);

    // Handle keydown for immediate response to Enter key
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateChordGrid();
        }
    });

    // Help icon functionality
    const helpIcon = document.getElementById('helpIcon');
    const helpPopup = document.getElementById('helpPopup');

    helpIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        helpPopup.classList.toggle('show');
    });

    // Print icon functionality
    const printIcon = document.getElementById('printIcon');
    printIcon.addEventListener('click', () => {
        window.print();
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (helpPopup.classList.contains('show') && 
            !helpPopup.contains(e.target) && 
            e.target !== helpIcon) {
            helpPopup.classList.remove('show');
        }
    });

    // Initial update
    updateChordGrid();
});
