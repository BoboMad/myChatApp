import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const token = localStorage.getItem("jwtToken");

    if (!isAuthenticated) {
        return <Navigate to='/login'/>
    }

    return children
};

export default ProtectedRoute;