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
const proxyToggleButton = document.querySelector('.search-container button');

proxyToggleButton.addEventListener('click', function() {
    this.classList.toggle('active');
});

urlInput.addEventListener("keydown", event => {
    if (event.key === "Enter") go();
});