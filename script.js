// script.js

// Function to detect touch devices
function isTouchDevice() {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// If it's a touch device, add 'no-hover' class to the body
if (isTouchDevice()) {
    document.documentElement.classList.add('no-hover');
}

// Existing script.js content follows...
import { vocabulary } from './words.js';

// Function to shuffle an array using Fisher-Yates Shuffle
function shuffleArray(array) {
    const shuffled = array.slice(); // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
}

// Initialize shuffled vocabulary list
let shuffledVocab = shuffleArray(vocabulary);

// Initialize current word index to a random position within the shuffled list
let currentIndex = Math.floor(Math.random() * shuffledVocab.length);

// Function to display the current word and emoji
function displayWord() {
    const currentWord = shuffledVocab[currentIndex];
    document.getElementById("wordText").textContent = currentWord.word;
    document.getElementById("emojiContainer").textContent = currentWord.emoji;
}

// Function to speak the current word using ResponsiveVoice
function speakWord() {
    const currentWord = shuffledVocab[currentIndex];
    if (window.responsiveVoice) {  // Check if responsiveVoice is available
        window.responsiveVoice.speak(currentWord.word, "UK English Female");
    } else {
        console.error("ResponsiveVoice is not loaded.");
    }
    
    // Trigger the click animation
    triggerEmojiAnimation();
}

// Function to trigger emoji animation
function triggerEmojiAnimation() {
    const emoji = document.getElementById("emojiContainer");
    emoji.classList.add("clicked");
    
    // Remove the class after the animation completes (200ms)
    setTimeout(() => {
        emoji.classList.remove("clicked");
    }, 200); // Duration should match the transition duration in CSS
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
    // Display the initial word and emoji
    displayWord();

    // Debounced functions
    const debouncedSpeakWord = debounce(speakWord, 300);
    const debouncedNextWord = debounce(() => {
        currentIndex = (currentIndex + 1) % shuffledVocab.length;
        displayWord();
    }, 300);
    const debouncedPrevWord = debounce(() => {
        currentIndex = (currentIndex - 1 + shuffledVocab.length) % shuffledVocab.length;
        displayWord();
    }, 300);

    // Event listener for emoji click/tap
    const emojiContainer = document.getElementById("emojiContainer");
    
    // To prevent double activation on touch devices
    let touchHandled = false;
    
    emojiContainer.addEventListener("touchstart", (e) => {
        touchHandled = true;
        debouncedSpeakWord();
    }, { passive: true });

    emojiContainer.addEventListener("click", (e) => {
        if (!touchHandled) {
            debouncedSpeakWord();
        }
        touchHandled = false;
    });

    // Event listeners for navigation buttons
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    
    // Next Button
    nextBtn.addEventListener("touchstart", (e) => {
        touchHandled = true;
        debouncedNextWord();
    }, { passive: true });

    nextBtn.addEventListener("click", (e) => {
        if (!touchHandled) {
            debouncedNextWord();
        }
        touchHandled = false;
    });

    // Previous Button
    prevBtn.addEventListener("touchstart", (e) => {
        touchHandled = true;
        debouncedPrevWord();
    }, { passive: true });

    prevBtn.addEventListener("click", (e) => {
        if (!touchHandled) {
            debouncedPrevWord();
        }
        touchHandled = false;
    });

    // Optional: Keyboard navigation for desktop
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % shuffledVocab.length;
            displayWord();
        } else if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + shuffledVocab.length) % shuffledVocab.length;
            displayWord();
        }
    });
});
