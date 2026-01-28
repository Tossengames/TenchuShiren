// character-comments.js - For final results feedback only

const characterPortraits = {
    rikimaru: "assets/characters/rikimaru.png",
    ayame: "assets/characters/ayame.png",
    tatsumaru: "assets/characters/tatsumaru.png"
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