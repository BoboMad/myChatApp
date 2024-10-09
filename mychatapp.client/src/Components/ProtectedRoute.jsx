import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        // You can render a loading spinner or a placeholder while loading the auth state
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to='/login'/>
    }

    return children
};

export default ProtectedRoute;