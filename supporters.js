// supporters.js
// List of clan allies/supporters for Tenchu Shiren

const supporters = [
    {
        name: "Rikimaru",
        handle: "@AzureShadow",
        role: "Master Ninja",
        contribution: "Primary stealth advisor"
    },
    {
        name: "Ayame",
        handle: "@CrimsonBlossom",
        role: "Kunoichi Specialist",
        contribution: "Speed and agility"
    },
    {
        name: "Tatsumaru",
        handle: "@FallenBlade",
        role: "Former Azuma Elite",
        contribution: "Advanced combat"
    },
    {
        name: "Lord Gohda",
        handle: "@GohdaLord",
        role: "Clan Patron",
        contribution: "Historical accuracy"
    },
    {
        name: "Matsunoshin",
        handle: "@GoldenRetainer",
        role: "Chief Strategist",
        contribution: "Mission ethics"
    },
    {
        name: "Shadow Walker",
        handle: "@NinjaPath",
        role: "Clan Supporter",
        contribution: "Early development"
    },
    {
        name: "Silent Blade",
        handle: "@StealthArt",
        role: "Weapons Master",
        contribution: "Tool design"
    },
    {
        name: "Kunoichi",
        handle: "@NightFlower",
        role: "Training Master",
        contribution: "Technique refinement"
    }
];

// Function to add new supporters dynamically
function addSupporter(newSupporter) {
    if (newSupporter && newSupporter.name) {
        supporters.push(newSupporter);
        updateSupportersList();
        return true;
    }
    return false;
}

// Function to update the UI list
function updateSupportersList() {
    const list = document.getElementById("supporters-list");
    if (list) {
        list.innerHTML = "";
        supporters.forEach(s => {
            const li = document.createElement("li");
            li.style.padding = "12px";
            li.style.borderBottom = "1px solid #333";
            li.style.marginBottom = "5px";
            li.innerHTML = `
                <div style="color: #d4af37; font-weight: bold; font-size: 1.1em;">${s.name}</div>
                <div style="color: #aaa; font-size: 0.9em;">${s.handle || ''}</div>
                <div style="color: #888; font-size: 0.85em; font-style: italic;">${s.role || 'Clan Ally'}</div>
            `;
            list.appendChild(li);
        });
    }
}

// Function to get supporter count
function getSupporterCount() {
    return supporters.length;
}

// Initialize when page loads
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', updateSupportersList);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supporters, addSupporter, getSupporterCount };
}