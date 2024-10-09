import '../../assets/css/ChatSideBar.css';
import { Link } from 'react-router-dom';

const ChatRoomList = ({ chatRooms, onJoinRoom }) => (
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
                    <li key={room.Id} onClick={() => onJoinRoom(room.Id)}>
                        {room.name || 'Private Chat'}
                    </li>
                ))
            ) : (
                <li>No conversations available</li>
            )}
        </ul>
    </div>
);

export default ChatRoomList;