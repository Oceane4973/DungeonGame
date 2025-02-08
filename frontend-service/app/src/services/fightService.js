const API_URL = 'http://localhost:8082/api';

export const fightService = {
    getFightResult: async (hero, monster, username) => {
        try {
            const response = await fetch(`${API_URL}/fight/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    heroId : hero.heroId,
                    monsterHealth: monster.pv,
                    monsterAttack: monster.attack,
                    monsterLevel: monster.level,
                    heroHealth: hero.pv,
                    heroAttack: hero.attack,
                    heroLevel: hero.level,
                    username: username
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des résultats du combat');
            }

            return response.json();
        } catch (error) {
            console.error('Erreur API :', error);
            throw error;
        }
    }
};
