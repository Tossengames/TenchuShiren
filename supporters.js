// supporters.js
// List of supporters for Tenchu Shiren

const supporters = [
    {
        name: "Rikimaru",
        handle: "@AzureShadow",
        role: "Master Ninja",
        contribution: "Stealth advisor"
    },
    {
        name: "Ayame",
        handle: "@CrimsonBlossom",
        role: "Kunoichi Specialist",
        contribution: "Speed techniques"
    },
    {
        name: "Tatsumaru",
        handle: "@FallenBlade",
        role: "Former Elite",
        contribution: "Combat strategy"
    },
    {
        name: "Lord Gohda",
        handle: "@GohdaLord",
        role: "Clan Patron",
        contribution: "Historical lore"
    },
    {
        name: "Shadow Walker",
        handle: "@NinjaPath",
        role: "Clan Supporter",
        contribution: "Early development"
    },
    {
        name: "Silent Blade",
        handle: "@StealthMaster",
        role: "Weapons Expert",
        contribution: "Tool knowledge"
    }
];

// Function to update supporters list in HTML
function updateSupportersList() {
    const list = document.getElementById('supporters-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    supporters.forEach(supporter => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${supporter.name}</strong>
            <br><small>${supporter.handle}</small>
            ${supporter.role ? `<br><em>${supporter.role}</em>` : ''}
        `;
        list.appendChild(li);
    });
}

// Function to get random appreciation message
function getSupporterAppreciation() {
    const messages = [
        "The shadows remember their allies.",
        "Your support strengthens the Azuma clan.",
        "Honor to those who stand with us.",
        "The clan thrives with allies like you.",
        "True allies walk in shadow with us.",
        "Your contribution preserves our traditions."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', updateSupportersList);
}