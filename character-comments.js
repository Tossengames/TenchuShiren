// character-comments.js - For final results feedback only

const characterPortraits = {
    rikimaru: "https://via.placeholder.com/150/8b0000/ffffff?text=RIKIMARU",
    ayame: "https://via.placeholder.com/150/8b0000/ffffff?text=AYAME",
    tatsumaru: "https://via.placeholder.com/150/8b0000/ffffff?text=TATSAMARU"
};

const characterNames = {
    rikimaru: "RIKIMARU",
    ayame: "AYAME",
    tatsumaru: "TATSAMARU"
};

function getCharacterPortrait(character) {
    return characterPortraits[character] || characterPortraits.rikimaru;
}

function getCharacterDisplayName(character) {
    return characterNames[character] || "MASTER";
}

// Export functions
window.getCharacterPortrait = getCharacterPortrait;
window.getCharacterDisplayName = getCharacterDisplayName;