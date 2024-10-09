import { useNavigate } from 'react-router-dom';
import ChatRoomList from './ChatRoomList';
import useChatRooms from '../../hooks/ChatRooms/useRooms';

const ChatsSideBarContainer = () => {
    const { chatRooms, fetchChatRooms } = useChatRooms();
    const navigate = useNavigate();


    const handleJoinRoom = (roomId) => {
        navigate(`/me/chat/${roomId}`);
    };

    return <ChatRoomList chatRooms={chatRooms} onJoinRoom={handleJoinRoom}  />;
};

export default ChatsSideBarContainer;