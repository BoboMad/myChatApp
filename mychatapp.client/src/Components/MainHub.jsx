import {useState} from 'react'
import { AuthContext } from '../Contexts/AuthContext';
import ChatsSidebar from './ChatsSideBar.jsx';
import AddFriends from './AddFriends.jsx'
import FriendNavbar from './FriendNavbar.jsx';
import Chat from './Chat.jsx';
import '../assets/css/MainHub.css'

const MainHub = () => {

    const [activeChat, setActiveChat] = useState("");

    const RenderContent = () => {

        if (activeChat) {
            <Chat chatId={activeChat} />
        }

    }

    return (
        <div className="hub-container">

            <div className="sidebar-column">
                <ChatsSidebar onChatSelect={setActiveChat} />
            </div>

            <div className="main-column">
                <FriendNavbar />
                <AddFriends/>
            </div>

        </div>
    )
}

export default MainHub;