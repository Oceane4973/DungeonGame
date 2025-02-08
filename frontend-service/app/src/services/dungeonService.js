const API_URL = `${process.env.REACT_APP_DUNGEONS_SERVICE_URL}/api`;

export const dungeonService = {
    getDungeon: async () => {
        const response = await fetch(`${API_URL}/dungeon`)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du donjon');
        }
        return response.json();
    }
};
