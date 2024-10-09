import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignalRChatContext } from '../../Contexts/SignalRChatContext';
import { AuthContext } from '../../Contexts/AuthContext';
import '../../assets/css/ChatSideBar.css'

const ChatRoomList = () => {
    const navigate = useNavigate();
    const { fetchChatMessagesForRoom, setCurrentRoomId } = useContext(SignalRChatContext);
    const { token } = useContext(AuthContext);
    const [chatRooms, SetChatRooms] = useState([]);



    useEffect(() => {
        fetchChatRooms();
    }, [token]);

    const fetchChatRooms = async () => {
        try {
            const response = await fetch('https://localhost:7292/api/Room', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                SetChatRooms(data);
            } else {
                console.error('Failed to fetch chat rooms');
            }
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const handleRoomClick = async (room) => {
        try {
            setCurrentRoomId(room.Id);
            await fetchChatMessagesForRoom(room.Id);
            navigate(`/me/chat/${room.Id}`);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    return (

        <div className="sidebar">
            <div className="home">
                <Link to="/me">
                    <i className="fa-solid fa-house"></i>
                </Link>

            </div>
            <h2>Conversations</h2>
            <ul>
                {chatRooms.length > 0 ? (
                    chatRooms.map((room) => (
                        <li key={room.Id} onClick={() => handleRoomClick(room)}>
                            <Link to={`/chat/${room.Id}`}>
                                {room.Id}
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>No conversations available</li>
                )}
            </ul>
        </div>
    )
}


export default ChatRoomList;