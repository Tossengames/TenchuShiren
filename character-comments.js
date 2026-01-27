// character-comments.js - Enhanced with more variety

const characterComments = {
    rikimaru: {
        correct: [
            "Correct. The Azuma way is subtle and sure.",
            "Your judgment is sound. The path of shadow requires such wisdom.",
            "Well reasoned. A ninja must understand both blade and mind.",
            "Yes. Remember, true strength lies in restraint.",
            "Good. The silent approach leaves no trace.",
            "Precise. Patience is a ninja's greatest weapon.",
            "Proper. We serve from darkness.",
            "Well chosen. Stealth over strength always.",
            "Excellent. You grasp the fundamentals.",
            "Indeed. The shadows favor the patient.",
            "Right. A true ninja moves without sound.",
            "Accurate. The mission comes before all.",
            "Good choice. Honor the old ways.",
            "Correct. Blood spilled in shadow waters our legacy.",
            "Yes. The night is our ally."
        ],
        incorrect: [
            "No. The scrolls teach otherwise.",
            "Incorrect. Study our ways more carefully.",
            "Wrong. A true ninja thinks before acting.",
            "That violates our code.",
            "Unwise. Consider the alternatives.",
            "No. The shadows demand precision.",
            "Incorrect. Lord Gohda would not approve.",
            "That would compromise the mission.",
            "Wrong. Reconsider your approach.",
            "No. The Azuma clan operates differently.",
            "Incorrect. Sentiment clouds judgment.",
            "Wrong. A shadow leaves no evidence.",
            "No. Think like the night wind.",
            "Incorrect. The old masters would disagree.",
            "Wrong. Blood spilled carelessly stains honor."
        ]
    },
    ayame: {
        correct: [
            "Excellent! Speed and grace win battles.",
            "Perfect! A kunoichi's intuition is key.",
            "Well done! The silent step prevails.",
            "Yes! Cleverness over brute force.",
            "Good! Adaptability is our strength.",
            "Correct! Sometimes the softest touch is strongest.",
            "Brilliant! You think like a true kunoichi.",
            "Yes! Precision over power.",
            "Perfect! The wind favors the swift.",
            "Excellent! Strategy beats strength.",
            "Right! Move like water, strike like ice.",
            "Good choice! The shadows embrace the clever.",
            "Yes! A true ninja adapts.",
            "Correct! Honor guides the blade.",
            "Well chosen! The night whispers wisdom."
        ],
        incorrect: [
            "No! Too direct. We work unseen.",
            "Incorrect! Patience would serve better.",
            "Wrong! A kunoichi must be subtle.",
            "No! Consider the consequences.",
            "Incorrect! That lacks elegance.",
            "Wrong! The silent way is better.",
            "No! That's not our method.",
            "Incorrect! We value life differently.",
            "No! The shadows are our allies.",
            "Wrong! Think like the night breeze.",
            "No! Grace over force.",
            "Incorrect! A true warrior thinks.",
            "Wrong! The path of honor is clear.",
            "No! The moon sees all mistakes.",
            "Incorrect! Blood should not be wasted."
        ]
    },
    tatsumaru: {
        correct: [
            "Hmph. You understand true power.",
            "Correct. Strength determines fate.",
            "Good. Power must be absolute.",
            "Yes. The strong make their own rules.",
            "Well chosen. Sentiment is weakness.",
            "Indeed. Control is everything.",
            "Good. Ambition requires conviction.",
            "Yes. Only results matter.",
            "Correct. The path of power is lonely.",
            "Well decided. Strength justifies all.",
            "Right. Power is its own reward.",
            "Good. The weak perish, the strong rule.",
            "Yes. Blood paves the way to power.",
            "Correct. There is no room for mercy.",
            "Well chosen. Destiny favors the strong."
        ],
        incorrect: [
            "Weak. Such thinking leads to failure.",
            "No! Power is taken, not given.",
            "Wrong. Sentimentality is a luxury.",
            "Incorrect. Only strength matters.",
            "No! You think like a servant.",
            "Wrong. The strong don't hesitate.",
            "No! Weakness disgusts me.",
            "Incorrect. Power has no room for doubt.",
            "Wrong. The path of power is clear.",
            "No! Only the strongest survive.",
            "Pathetic. You lack conviction.",
            "Wrong. Blood must be spilled for power.",
            "No! Mercy is for the defeated.",
            "Incorrect. The strong write history.",
            "Wrong. Power cares not for your morals."
        ]
    }
};

// Character portraits (using placeholders - replace with actual image URLs)
const characterPortraits = {
    rikimaru: "https://via.placeholder.com/150/8b0000/ffffff?text=RIKIMARU",
    ayame: "https://via.placeholder.com/150/8b0000/ffffff?text=AYAME",
    tatsumaru: "https://via.placeholder.com/150/8b0000/ffffff?text=TATSAMARU"
};

// Character display names
const characterNames = {
    rikimaru: "RIKIMARU",
    ayame: "AYAME",
    tatsumaru: "TATSAMARU"
};

// Character titles
const characterTitles = {
    rikimaru: "Azure Shadow",
    ayame: "Crimson Blossom",
    tatsumaru: "Fallen Blade"
};

function getCharacterComment(character, isCorrect) {
    if (!characterComments[character]) {
        character = 'rikimaru';
    }
    
    const pool = isCorrect ? characterComments[character].correct : characterComments[character].incorrect;
    return pool[Math.floor(Math.random() * pool.length)];
}

function getCharacterPortrait(character) {
    return characterPortraits[character] || characterPortraits.rikimaru;
}

function getCharacterDisplayName(character) {
    return characterNames[character] || "MASTER";
}

function getCharacterTitle(character) {
    return characterTitles[character] || "Shadow";
}

// Export functions
window.getCharacterComment = getCharacterComment;
window.getCharacterPortrait = getCharacterPortrait;
window.getCharacterDisplayName = getCharacterDisplayName;
window.getCharacterTitle = getCharacterTitle;