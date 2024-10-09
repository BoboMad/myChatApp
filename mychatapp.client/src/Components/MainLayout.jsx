import { Outlet } from 'react-router-dom'
import ChatsSidebarContainer from '../Components/ChatSideBar/ChatSideBarContainer';


import '../assets/css/MainLayout.css';

const MainLayout = () => {

    return (
        <div className="hub-container">

            <div className="sidebar-column">
                <ChatsSidebarContainer/>
            </div>

            <div className="main-column">
                <Outlet/>

            </div>
        </div>
    )
}

export default MainLayout;