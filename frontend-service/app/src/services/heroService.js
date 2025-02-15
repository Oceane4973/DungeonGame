const API_URL = `${process.env.REACT_APP_HEROES_SERVICE_URL}/api/heroes`;

export const heroService = {
    getHeads: async () => {
        const response = await fetch(`${API_URL}/heads`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des têtes');
        }
        return response.json();
    },

    getBodies: async () => {
        const response = await fetch(`${API_URL}/bodies`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des corps');
        }
        return response.json();
    },

    createHero: async (heroData) => {
        const response = await fetch(`${API_URL}/hero`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(heroData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création du héros');
        }
        return response.json();
    },

    getHeroes: async (userId) => {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${API_URL}/heroByUserId?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des héros');
        }
        return response.json();
    },

    getHeroById: async (heroId) => {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

        if (!token) {
            throw new Error('Non authentifié');
        }

        const response = await fetch(`${API_URL}/heroById?id=${heroId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du héros');
        }
        return response.json();
    }
};
