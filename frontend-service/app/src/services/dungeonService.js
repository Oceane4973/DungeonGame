const API_URL = 'http://localhost:8084/api';

export const dungeonService = {
    getDungeon: async () => {
        const response = await fetch(`${API_URL}/dungeon`)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du donjon');
        }
        return response.json();
    }
};
