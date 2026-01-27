// character-comments.js
// Character-specific feedback with varied responses

const characterComments = {
    rikimaru: {
        correct: [
            "A precise choice. The Azuma way is subtle and sure.",
            "Your judgment is sound. The path of shadow requires such wisdom.",
            "Well reasoned. A ninja must understand both blade and mind.",
            "Correct. Remember, true strength lies in restraint.",
            "Good. The silent approach leaves no trace.",
            "Yes. Patience is a ninja's greatest weapon.",
            "Proper. We serve from darkness.",
            "Well chosen. Stealth over strength always.",
            "Excellent. You grasp the fundamentals.",
            "Indeed. The shadows favor the patient."
        ],
        incorrect: [
            "Unwise. Consider the alternatives.",
            "No. The scrolls teach otherwise.",
            "Incorrect. Study our ways more carefully.",
            "That would compromise the mission.",
            "Wrong. A true ninja thinks before acting.",
            "No. The shadows demand precision.",
            "Incorrect. Lord Gohda would not approve.",
            "That violates our code.",
            "No. The Azuma clan operates differently.",
            "Wrong. Reconsider your approach."
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
            "Excellent! Strategy beats strength."
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
            "Wrong! Think like the night breeze."
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
            "Well decided. Strength justifies all."
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
            "No! Only the strongest survive."
        ]
    }
};

// Function to get a random comment from a character
function getCharacterComment(characterName, isCorrect) {
    const character = characterComments[characterName];
    if (!character) {
        // Fallback to Rikimaru if character not found
        const pool = isCorrect ? characterComments.rikimaru.correct : characterComments.rikimaru.incorrect;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    
    const pool = isCorrect ? character.correct : character.incorrect;
    return pool[Math.floor(Math.random() * pool.length)];
}

// Function to get character portrait
function getCharacterPortrait(characterName) {
    const portraits = {
        rikimaru: "assets/characters/rikimaru.png",
        ayame: "assets/characters/ayame.png",
        tatsumaru: "assets/characters/tatsumaru.png"
    };
    return portraits[characterName] || "assets/characters/rikimaru.png";
}

// Function to get character display name
function getCharacterDisplayName(characterName) {
    const names = {
        rikimaru: "Rikimaru",
        ayame: "Ayame",
        tatsumaru: "Tatsumaru"
    };
    return names[characterName] || "Master";
}

// Function to get a random supporter appreciation message
function getSupporterAppreciation() {
    const appreciations = [
        "Your support strengthens the Azuma clan. We honor your loyalty.",
        "The shadows remember their allies. Thank you for your support.",
        "Your contribution helps preserve our ancient ways. We are grateful.",
        "Honor to those who stand with the Azuma. Your support is noted.",
        "The clan thrives with allies like you. We acknowledge your contribution.",
        "Your support allows our traditions to continue. The clan is in your debt.",
        "True allies walk in shadow with us. Thank you for your support.",
        "The Azuma clan honors those who support our cause. You have our gratitude.",
        "Your contribution helps train new shadows. The clan thanks you.",
        "Support from true believers ensures our legacy continues. We honor you."
    ];
    return appreciations[Math.floor(Math.random() * appreciations.length)];
}