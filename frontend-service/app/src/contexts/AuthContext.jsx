import { createContext, useState, useEffect } from "react";
import UserService from "../services/userService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = UserService.isAuthenticated();
            setIsLoggedIn(isAuth);
            
            if (isAuth) {
                try {
                    const userData = await UserService.getUserDetails();
                    setUser(userData);
                } catch (error) {
                    console.error("Erreur lors de la récupération des données utilisateur:", error);
                }
            }
            
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const userData = await UserService.login(username, password);
            setIsLoggedIn(true);
            setUser({
                ...userData,
                id: userData.id
            });
            return true;
        } catch (error) {
            alert(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        UserService.logout();
        setIsLoggedIn(false);
        setUser(null);
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}