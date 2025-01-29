import userService from '../services/userService.js';

export default class HeroesController {
    constructor() {
        this.setupHeroes();
        this.setupLogout();
        this.loadUserDetails();
    }

    async loadUserDetails() {
        try {
            const userDetails = await userService.getUserDetails();
            const goldSpan = document.querySelector('.gold-container span');
            if (goldSpan && userDetails.gold !== undefined) {
                goldSpan.textContent = `Nombre de gold : ${userDetails.gold}`;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des détails utilisateur:', error);
        }
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
