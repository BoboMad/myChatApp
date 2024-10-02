import { AuthContext } from '../Contexts/AuthContext';
import ChatsSidebar from './ChatsSideBar.jsx';
import AddFriends from './AddFriends.jsx'
import '../assets/css/MainHub.css'

const MainHub = () => {
    return (
        <div className="hub-container">

            <div className="sidebar-column">
                <ChatsSidebar />
            </div>

            <div className="main-column">
                <AddFriends/>
            </div>

        </div>
    )
}

export default MainHub;