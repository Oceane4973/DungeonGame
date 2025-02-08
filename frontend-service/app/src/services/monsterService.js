const API_URL = `${process.env.REACT_APP_MONSTERS_SERVICE_URL}/api`;

export const monsterService = {
    getMonster: async () => {
        const response = await fetch(`${API_URL}/monsters/random/2`)
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du donjon');
        }
        return response.json();
    }
};
