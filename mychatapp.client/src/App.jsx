import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute'
import Login from './Components/Login-register/Login.jsx'
import Register from './Components/Login-register/Register.jsx'
import MainLayout from './Components/MainLayout.jsx'
import FriendLayout from './Components/Friends/FriendLayout.jsx'
import { AuthProvider } from './Contexts/AuthContext'
import { SignalRChatProvider } from './contexts/SignalRChatContext';
import { FriendRequestProvider } from './Contexts/FriendRequestContext';
import ChatContainer from './Components/Chat/ChatContainer';


function App() {

    return (<>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <SignalRChatProvider>
                                <FriendRequestProvider>
                                    <MainLayout />
                                </FriendRequestProvider>
                            </SignalRChatProvider>
                        </ProtectedRoute>
                    }>
 
                        <Route path="me/chat/:id" element={<ChatContainer />} />
                        <Route path="me" element={<FriendLayout />} />

                    </Route>
                </Routes>
            </Router>

        </AuthProvider>
            </>
    );
    
}

export default App;