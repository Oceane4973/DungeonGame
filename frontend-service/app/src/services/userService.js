class UserService {
    async login(username, password) {
        try {
            const response = await fetch('http://localhost:8081/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
                } else if (response.status === 403) {
                    throw new Error('Accès refusé');
                } else {
                    throw new Error('Une erreur est survenue lors de la connexion');
                }
            }

            const data = await response.json().catch(() => {
                throw new Error('Format de réponse invalide');
            });

            if (data.token) {
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('isLoggedIn', 'true');
                return data;
            } else {
                throw new Error('Réponse du serveur invalide');
            }
        } catch (error) {
            if (error.name === 'SyntaxError') {
                throw new Error('Format de données invalide');
            }
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('selectedHero');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAuthenticated() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    getAuthToken() {
        const user = this.getCurrentUser();
        return user?.token;
    }

    async signup(username, password) {
        try {
            const response = await fetch('http://localhost:8081/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('Ce nom d\'utilisateur existe déjà');
                } else {
                    throw new Error('Une erreur est survenue lors de l\'inscription');
                }
            }

            const data = await response.json().catch(() => {
                throw new Error('Format de réponse invalide');
            });

            return data;
        } catch (error) {
            if (error.name === 'SyntaxError') {
                throw new Error('Format de données invalide');
            }
            throw error;
        }
    }

    async getUserDetails() {
        try {
            const token = this.getAuthToken();
            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch('http://localhost:8081/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails utilisateur');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur getUserDetails:', error);
            throw error;
        }
    }
}

const userService = new UserService();
export default userService;

