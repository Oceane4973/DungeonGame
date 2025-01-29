export default class HeroesController {
    constructor() {
        this.setupHeroes();
        this.setupLogout();
    }

    setupHeroes() {
        const heroes = [
            { name: 'Guerrier', type: 'warrior' },
            { name: 'Mage', type: 'mage' },
            { name: 'Archer', type: 'archer' }
        ];

        const heroesGrid = document.querySelector('.heroes-grid');
        
        heroes.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';
            heroCard.innerHTML = `<h3>${hero.name}</h3>`;
            
            heroCard.addEventListener('click', () => {
                localStorage.setItem('selectedHero', hero.type);
                window.location.href = '../dungeon/dungeon.html';
            });
            
            heroesGrid.appendChild(heroCard);
        });
    }

    setupLogout() {
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                window.location.href = '../../../index.html';
            });
        }
    }
}

new HeroesController();
