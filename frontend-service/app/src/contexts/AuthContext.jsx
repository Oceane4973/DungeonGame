import { createContext, useState, useEffect } from "react";
import UserService from "../services/userService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoggedIn(UserService.isAuthenticated());
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try {
            await UserService.login(username, password);
            setIsLoggedIn(true);
            return true; // Indique que la connexion est réussie
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
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}