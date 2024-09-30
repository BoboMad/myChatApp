import { createContext, useState, useEffect } from 'react';
import {jwtDecode}  from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //set existing token
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken && !isTokenExpired(storedToken)) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }
        else {
            setToken(null);
            setIsAuthenticated(false);
        }
    }, []);

    //set token
    const updateToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem('jwtToken', newToken);
        setIsAuthenticated(true);
    };

    //logout
    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('jwtToken');
    };

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (e) {
            return true;
        }
    };

    return (
        <AuthContext.Provider value={{
            token,
            updateToken,
            isAuthenticated,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}