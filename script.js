// script.js

import { vocabulary } from './words.js';

// Initialize current word index
let currentIndex = 0;

// Function to display the current word and emoji
function displayWord() {
    const currentWord = vocabulary[currentIndex];
    document.getElementById("wordText").textContent = currentWord.word;
    document.getElementById("emojiContainer").textContent = currentWord.emoji;
}

// Function to speak the current word using ResponsiveVoice
function speakWord() {
    const currentWord = vocabulary[currentIndex];
    if (window.responsiveVoice) {  // Check if responsiveVoice is available
        window.responsiveVoice.speak(currentWord.word, "UK English Female");
    } else {
        console.error("ResponsiveVoice is not loaded.");
    }
}

// Debounce function to prevent multiple rapid calls
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Initialize display and event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Display the first word and emoji
    displayWord();

    // Event listener for emoji click/tap
    const emojiContainer = document.getElementById("emojiContainer");
    emojiContainer.addEventListener("click", debounce(speakWord, 300));
    emojiContainer.addEventListener("touchend", debounce(speakWord, 300));

    // Event listeners for navigation buttons
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    nextBtn.addEventListener("click", debounce(() => {
        currentIndex = (currentIndex + 1) % vocabulary.length;
        displayWord();
    }, 300));

    nextBtn.addEventListener("touchend", debounce(() => {
        currentIndex = (currentIndex + 1) % vocabulary.length;
        displayWord();
    }, 300));

    prevBtn.addEventListener("click", debounce(() => {
        currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
        displayWord();
    }, 300));

    prevBtn.addEventListener("touchend", debounce(() => {
        currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
        displayWord();
    }, 300));

    // Optional: Keyboard navigation for desktop
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % vocabulary.length;
            displayWord();
        } else if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + vocabulary.length) % vocabulary.length;
            displayWord();
        }
    });
});
