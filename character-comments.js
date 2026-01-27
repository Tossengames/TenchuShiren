// character-comments.js
// Character feedback for Tenchu Shiren

const characterComments = {
    rikimaru: {
        correct: [
            "Correct. The Azuma way is subtle and sure.",
            "Well reasoned. A ninja must understand both blade and mind.",
            "Good judgment. True strength lies in restraint.",
            "Yes. The silent approach leaves no trace.",
            "Proper. We serve from darkness."
        ],
        incorrect: [
            "No. The scrolls teach otherwise.",
            "Incorrect. Study our ways more carefully.",
            "Wrong. A true ninja thinks before acting.",
            "That violates our code.",
            "Unwise. Consider the alternatives."
        ]
    },
    ayame: {
        correct: [
            "Excellent! Speed and grace win battles.",
            "Well done! A kunoichi's intuition is key.",
            "Perfect! The silent step prevails.",
            "Yes! Cleverness over brute force.",
            "Good! Adaptability is our strength."
        ],
        incorrect: [
            "No! Too direct. We work unseen.",
            "Incorrect! Patience would serve better.",
            "Wrong! A kunoichi must be subtle.",
            "No! Consider the consequences.",
            "Incorrect! That lacks elegance."
        ]
    },
    tatsumaru: {
        correct: [
            "Hmph. You understand true power.",
            "Correct. Strength determines fate.",
            "Good. Power must be absolute.",
            "Yes. The strong make their own rules.",
            "Well chosen. Sentiment is weakness."
        ],
        incorrect: [
            "Weak. Such thinking leads to failure.",
            "No! Power is taken, not given.",
            "Wrong. Sentimentality is a luxury.",
            "Incorrect. Only strength matters.",
            "No! You think like a servant."
        ]
    }
};

// Get character comment
function getCharacterComment(character, isCorrect) {
    if (!characterComments[character]) {
        character = 'rikimaru'; // Default to Rikimaru
    }
    
    const pool = isCorrect ? characterComments[character].correct : characterComments[character].incorrect;
    return pool[Math.floor(Math.random() * pool.length)];
}

// Get character portrait (placeholder images)
function getCharacterPortrait(character) {
    const portraits = {
        rikimaru: "https://via.placeholder.com/100/8b0000/ffffff?text=R",
        ayame: "https://via.placeholder.com/100/8b0000/ffffff?text=A",
        tatsumaru: "https://via.placeholder.com/100/8b0000/ffffff?text=T"
    };
    return portraits[character] || portraits.rikimaru;
}

// Get character display name
function getCharacterDisplayName(character) {
    const names = {
        rikimaru: "Rikimaru",
        ayame: "Ayame",
        tatsumaru: "Tatsumaru"
    };
    return names[character] || "Master";
}