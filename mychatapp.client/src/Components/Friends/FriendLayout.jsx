import { useState } from 'react';
import AddFriends from './AddFriends.jsx'
import FriendNavbar from './FriendNavbar.jsx';
import FriendOnline from './FriendOnline.jsx';
import FriendRequest from './FriendRequest.jsx';
import Friends from './Friends.jsx';


const FriendLayout = () => {
    const [selectedComponent, setSelectedComponent] = useState("Friends")

    const RenderContent = () => {

        switch (selectedComponent) {
            case 'Friends':
                return <Friends />
            case 'FriendOnline':
                return <FriendOnline />;
            case 'AddFriends':
                return <AddFriends />
            case 'FriendRequest':
                return <FriendRequest />
            default:
                return <Friends />
        }

    }


    return (
        <>
            <div className="friendNavbar-container">
                <FriendNavbar selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />
            </div>

            <div className="friend-component-container">
                {RenderContent()}
            </div>
        </>
    )
}

export default FriendLayout;