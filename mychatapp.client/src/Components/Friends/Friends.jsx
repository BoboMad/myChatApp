import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import { SignalRChatContext } from '../../Contexts/SignalRChatContext';
import '../../assets/css/Friends.css'

const Friends = () => {

    const [friends, setFriends] = useState([]);
    const { token } = useContext(AuthContext);
    const { JoinRoom, currentRoomId } = useContext(SignalRChatContext);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch("https://localhost:7292/api/Friend/getfriends", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }

                const data = await response.json();
                setFriends(data);

            }
            catch (error) {
                console.log(error);
            }
        }

        fetchFriends();
    }, []);

    const startChat = async (friendId) => {
        await JoinRoom(friendId);
    }

    return (
        <div className="friends-wrapper">
            <div className="info">
                Friends - {friends.length}
            </div>

            {friends.length === 0 ? 
                (<p>You have no friends yet.</p>)
                :
                (
                    <ul>
                        {friends.map(friend => (
                            <li key={friend.FriendId}>
                                <div className="content-wrapper">

                                    <div className="friend-info">
                                        <div className="friend-name">{friend.FriendUsername}</div>
                                        <div className="status">Online</div>
                                    </div>

                                    <div className="button-wrapper">

                                        <button className="friend-button"
                                                onClick={() => startChat(friend.FriendId)}>
                                            <i className="fa-regular fa-message"></i>
                                        </button>

                                        <button className="friend-button">
                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                        </button>

                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )
             }
        </div>
    )
}

export default Friends;