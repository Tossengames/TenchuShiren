// supporters.js - Simplified with only names and handles

const supporters = [
    {
        name: "Shadow Walker",
        handle: "@NinjaPath"
    },
    {
        name: "Silent Blade",
        handle: "@StealthMaster"
    },
    {
        name: "Kunoichi",
        handle: "@NightFlower"
    }
];

function updateSupportersList() {
    const list = document.getElementById('supporters-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    supporters.forEach(supporter => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="supporter-name">${supporter.name}</div>
            <div class="supporter-handle">${supporter.handle}</div>
        `;
        list.appendChild(li);
    });
}

function getSupporterAppreciation() {
    const messages = [
        "The shadows remember their allies.",
        "Your support strengthens the Azuma clan.",
        "Honor to those who stand with the Azuma.",
        "The clan thrives with allies like you.",
        "True allies walk in shadow with us."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Add supporter dynamically
function addSupporter(name, handle) {
    supporters.push({
        name: name,
        handle: handle || `@${name.replace(/\s+/g, '')}`
    });
    
    updateSupportersList();
    return true;
}

// Get random supporter
function getRandomSupporter() {
    return supporters[Math.floor(Math.random() * supporters.length)];
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', updateSupportersList);
    window.addSupporter = addSupporter;
    window.getRandomSupporter = getRandomSupporter;
}