import { createContext, useState, useEffect } from 'react';
import {jwtDecode}  from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    //Decode token
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };


    //set existing token
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');

        if (storedToken && !isTokenExpired(storedToken)) {
            setToken(storedToken);
            setIsAuthenticated(true);

            const decodedToken = decodeToken(storedToken);
            const nameId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            if (decodedToken) {
                setUserId(nameId)
            }
        }
        
        else {
            setToken(null);
            setIsAuthenticated(false);
            setUserId(null);
        }

        setLoading(false);

    }, [token]);


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
        setUserId(null);
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
            logout,
            userId,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}