import { Outlet } from 'react-router-dom'
import ChatRoomList from './ChatSideBar/ChatRoomList.jsx'

import '../assets/css/MainLayout.css';

const MainLayout = () => {

    return (
        <div className="hub-container">

            <div className="sidebar-column">
                <ChatRoomList/>
            </div>

            <div className="main-column">
                <Outlet/>

            </div>
        </div>
    )
}

export default MainLayout;