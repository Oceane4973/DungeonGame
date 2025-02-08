const API_URL = `${process.env.REACT_APP_FIGHTS_SERVICE_URL}/api`;

export const fightService = {
    getFightResult: async (hero, monster, username) => {
        try {
            const response = await fetch(`${API_URL}/fights`, {
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
                    heroId: hero.id,
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
