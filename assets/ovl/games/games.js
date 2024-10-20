document.addEventListener('DOMContentLoaded', () => {
    const gamesOverlay = document.getElementById('gamesOverlay');
    const searchInput = gamesOverlay.querySelector('.search-container__input');
    
    const games = [
        { name: 'slither.io', url: 'https://slither.io' },
        { name: 'nzp.gay', url: 'https://nzp.gay' },
        // ... other games ...
    ];

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';

    const gameButtons = games.map(game => {
        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = game.name;
        button.addEventListener('click', () => new ABC({ type: "blank", url: game.url }).open());

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';
        buttonWrapper.appendChild(button);
        return buttonWrapper;
    });

    buttonsContainer.append(...gameButtons);
    gamesOverlay.appendChild(buttonsContainer);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        gameButtons.forEach(wrapper => {
            const gameName = wrapper.querySelector('.button').textContent.toLowerCase();
            wrapper.style.display = gameName.includes(searchTerm) ? 'block' : 'none';
        });
    });
});