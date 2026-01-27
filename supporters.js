// supporters.js - Enhanced with more supporters

const supporters = [
    {
        name: "Rikimaru",
        handle: "@AzureShadow",
        role: "Master Ninja",
        contribution: "Stealth Techniques",
        joinDate: "Ancient Times"
    },
    {
        name: "Ayame",
        handle: "@CrimsonBlossom",
        role: "Kunoichi Elite",
        contribution: "Speed & Agility",
        joinDate: "Ancient Times"
    },
    {
        name: "Tatsumaru",
        handle: "@FallenBlade",
        role: "Former Azuma Elite",
        contribution: "Combat Strategy",
        joinDate: "Before The Fall"
    },
    {
        name: "Lord Gohda",
        handle: "@GohdaLord",
        role: "Clan Patron",
        contribution: "Historical Lore",
        joinDate: "Eternal"
    },
    {
        name: "Shadow Walker",
        handle: "@NinjaPath",
        role: "Clan Ally",
        contribution: "Early Development",
        joinDate: "2023"
    },
    {
        name: "Silent Blade",
        handle: "@StealthMaster",
        role: "Weapons Expert",
        contribution: "Tool Knowledge",
        joinDate: "2023"
    },
    {
        name: "Kunoichi",
        handle: "@NightFlower",
        role: "Training Master",
        contribution: "Technique Refinement",
        joinDate: "2024"
    },
    {
        name: "Ghost of Tsushima",
        handle: "@JinSakai",
        role: "Honorary Ally",
        contribution: "Inspiration",
        joinDate: "2020"
    },
    {
        name: "Tenchu Veteran",
        handle: "@OldSchoolNinja",
        role: "Lore Keeper",
        contribution: "Historical Accuracy",
        joinDate: "1998"
    },
    {
        name: "Shadow Council",
        handle: "@AzumaCouncil",
        role: "Clan Leadership",
        contribution: "Guidance",
        joinDate: "Ancient Times"
    }
];

function updateSupportersList() {
    const list = document.getElementById('supporters-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    supporters.forEach(supporter => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="supporter-card">
                <strong>${supporter.name}</strong>
                <div class="supporter-handle">${supporter.handle}</div>
                <div class="supporter-role">${supporter.role}</div>
                <div class="supporter-contribution">
                    <i class="fas fa-star"></i>
                    ${supporter.contribution}
                </div>
                <div class="supporter-date">
                    <i class="fas fa-calendar"></i>
                    Joined: ${supporter.joinDate}
                </div>
            </div>
        `;
        list.appendChild(li);
    });
}

function getSupporterAppreciation() {
    const messages = [
        "The shadows remember their allies. Blood binds us tighter than steel.",
        "Your support strengthens the Azuma clan. We honor your loyalty in our scrolls.",
        "Honor to those who stand with the Azuma. Your names echo through the darkness.",
        "The clan thrives with allies like you. We acknowledge your contribution.",
        "True allies walk in shadow with us. Thank you for preserving our way.",
        "Your contribution helps train new shadows. The clan is in your debt.",
        "From the darkness, we give thanks. Your support ensures our legacy continues.",
        "Blood spilled together binds us. We honor your commitment to the Azuma way.",
        "The way of the ninja values loyalty above all. You have proven yours.",
        "In silence, we remember. In shadow, we honor. Thank you for your support."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Add supporter dynamically
function addSupporter(name, handle, role, contribution) {
    supporters.push({
        name: name,
        handle: handle,
        role: role || "Clan Ally",
        contribution: contribution || "Supporter",
        joinDate: new Date().getFullYear().toString()
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