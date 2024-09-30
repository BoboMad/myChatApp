import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx'
import MainHub from './Components/MainHub.jsx'
import { AuthProvider } from './Contexts/AuthContext'

function App() {

    return (<>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/chat" element={<ProtectedRoute>
                                                    <MainHub />
                                                 </ProtectedRoute>} />

                    <Route path='*' element={<Navigate to="/chat"/> }/>
                </Routes>
            </Router>

        </AuthProvider>
            </>
    );
    
}

export default App;