import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import Chat from './Chat.jsx';
import ChatsSidebar from './ChatsSideBar.jsx';

import { Outlet, useParams } from 'react-router-dom';
import AddFriends from './AddFriends';

const MainHub = () => {
    return (
        <div className="hub-container">
            <AddFriends/>
            <ChatsSidebar/>
            <Chat />
        </div>
    )
}

export default MainHub;