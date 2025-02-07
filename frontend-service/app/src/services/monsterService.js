const API_URL = 'http://localhost:8085/api';

export const monsterService = {
    getMonster: async () => {
        const response = await fetch(`${API_URL}/monsters/random/2`)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du donjon');
        }
        return response.json();
    }
};
