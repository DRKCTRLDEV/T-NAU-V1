class ABC {
    constructor({ type = "blank", url = "about:blank" } = {}) {
        this.type = type;
        this.url = url;
    }

    getCode() {
        return `<iframe style="height:100%; width: 100%; border: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0;" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation" src="${this.url}"></iframe>`;
    }

    open() {
        const code = this.getCode();
        try {
            switch (this.type) {
                case "blank":
                    const win = window.open();
                    if (win) {
                        win.document.body.innerHTML = code;
                    } else {
                        console.error("Popup blocked");
                    }
                    break;
                case "blob":
                    const blob = new Blob([code], { type: "text/html" });
                    window.open(URL.createObjectURL(blob));
                    break;
                case "overwrite":
                    document.body.innerHTML = code;
                    break;
                default:
                    console.error("Invalid type");
            }
        } catch (error) {
            console.error("Error opening page:", error);
        }
    }
}

// Optimize validURL function
const validURL = url => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

async function go() {
    const url = urlInput.value;
    if (!validURL(url)) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        const finalUrl = proxyToggleButton.classList.contains('active') ? await fetchProxyUrl(url) : url;
        new ABC({ type: "blank", url: finalUrl }).open();
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}

async function fetchProxyUrl(url) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const blob = new Blob([data.contents], { type: 'text/html' });
    return URL.createObjectURL(blob);
}

const urlInput = document.getElementById("urlInput");
const proxyToggleButton = document.querySelector('.button-proxy');

proxyToggleButton.addEventListener('click', function() {
    this.classList.toggle('active');
});

urlInput.addEventListener("keydown", event => {
    if (event.key === "Enter") go();
});

// Simplified overlay handling
const overlays = {
    info: document.getElementById('overlay-info'),
    games: document.getElementById('overlay-games')
};

const buttons = {
    panic: document.getElementById('button-panic'),
    info: document.getElementById('button-info'),
    games: document.getElementById('button-games')
};

const toggleOverlay = overlayKey => {
    overlays[overlayKey].classList.toggle('active');
    if (overlayKey === 'games') {
        buttons.games.classList.toggle('active');
    }
};

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('overlay')) {
        event.target.classList.remove('active');
        if (event.target === overlays.games) {
            buttons.games.classList.remove('active');
        }
    }
});

Object.entries(buttons).forEach(([key, button]) => {
    button.addEventListener('click', () => toggleOverlay(key));
});

const games = {
    "1v1.LOL": "https://1v1.lol/",
    "2048": "https://play2048.co/",
    "Bonk.io": "https://bonk.io/",
    "Brutal.io": "https://brutal.io/",
    "BuildRoyale.io": "https://buildroyale.io/",
    "COD Zombies": "https://nzp.gay/",
    "Deeeep.io": "https://deeeep.io/",
    "Diep.io": "https://diep.io/",
    "Minecraft 1.5.2": "",
    "Minecraft 1.7.10": "",
    "Minecraft 1.8.8": "https://eaglercraft.net/",
    "Gartic.io": "https://gartic.io/",
    "Hole.io": "https://hole-io.com/",
    "Krunker.io": "https://krunker.io/",
    "Lordz.io": "https://lordz.io/",
    "Moomoo.io": "https://moomoo.io/",
    "Mope.io": "https://mope.io/",
    "Paper.io": "https://paper-io.com/",
    "Powerline.io": "https://powerline.io/",
    "Shell Shockers": "https://shellshock.io/",
    "Slither.io": "https://slither.io/",
    "Splix.io": "https://splix.io/",
    "Stabfish.io": "https://stabfish.io/",
    "Starblast.io": "https://starblast.io/",
    "Superhex.io": "https://superhex.io/",
    "Venge.io": "https://venge.io/",
    "Warbot.io": "https://warbot.io/",
    "Wings.io": "https://wings.io/",
    "Wordle": "https://wordlegame.org/",
    "Zombs Royale": "https://zombsroyale.io/",
};

function createGameButtons() {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-buttons-container');
    
    gameContainer.innerHTML = Object.entries(games).map(([name, url]) => `
        <button class="button button-game" data-url="${url}">
            <i class="fa-solid fa-gamepad"></i> ${name}
        </button>
    `).join('');
    
    overlays.games.appendChild(gameContainer);

    gameContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('button-game')) {
            new ABC({ type: "blank", url: event.target.dataset.url }).open();
        }
    });

    window.gameButtonsContainer = gameContainer;
}

const GameSearch = document.getElementById('GameSearch');

const filterGames = () => {
    const searchTerm = GameSearch.value.toLowerCase();
    const gameButtons = window.gameButtonsContainer.querySelectorAll('.button-game');

    gameButtons.forEach(button => {
        const gameName = button.textContent.toLowerCase();
        button.style.display = gameName.includes(searchTerm) ? '' : 'none';
    });
};

GameSearch.addEventListener('input', filterGames);

document.addEventListener('DOMContentLoaded', () => {
    createGameButtons();
    filterGames();
});