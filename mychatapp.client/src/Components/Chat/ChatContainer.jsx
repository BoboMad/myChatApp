import ChatUI from './ChatUI';
import useChat from '../../hooks/Chat/useChat';

const ChatContainer = () => {
    const { messages, message, loading, userId, handleInputChange, handleKeyDown } = useChat();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ChatUI
            messages={messages}
            message={message}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            currentUserId={userId}
        />
    )
}
export default ChatContainer;