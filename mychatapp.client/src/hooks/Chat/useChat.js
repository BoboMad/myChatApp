import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SignalRChatContext } from '../../Contexts/SignalRChatContext';
import { AuthContext } from '../../Contexts/AuthContext';

const useChat = () => {

    const { sendMessage, messages, currentRoomId, fetchChatMessagesForRoom } = useContext(SignalRChatContext);
    const { userId } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const LoadPrevMessages = async () => {
            try {
                    fetchChatMessagesForRoom(currentRoomId)
                } catch (error) {
                    console.error('Error joining room or loading messages:', error);
                } finally {
                    setLoading(false);
                }

        };

        LoadPrevMessages();
    }, [currentRoomId]);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message && message.trim().length > 0) {
                sendMessage(message.trim());
                setMessage('');
            }
        }
    };

    return {
        messages,
        message,
        loading,
        userId,
        handleInputChange,
        handleKeyDown
    };
}

export default useChat;