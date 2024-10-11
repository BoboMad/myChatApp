import {useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { SignalRChatContext } from '../../Contexts/SignalRChatContext';
import { AuthContext } from '../../Contexts/AuthContext';
import '../../assets/css/Chat.css';

const ChatContainer = () => {
    const [message, SetMessage] = useState('')

    const { sendMessage, messages, fetchChatMessagesForRoom, setCurrentRoomId, isLoading, fetchFriends, friends, addUsersToRoom } = useContext(SignalRChatContext)
    const { userId } = useContext(AuthContext)
    const [showFriendsList, setShowFriendsList] = useState(false)

    const messageEndRef = useRef(null);
    const inputRef = useRef(null);
    const friendsListRef = useRef(null);
    const { id: roomId } = useParams();


    useEffect(() => {
        if (roomId) {
            setCurrentRoomId(roomId);
            fetchChatMessagesForRoom(roomId);
        }
    }, [roomId, setCurrentRoomId]);


    const handleInputChange = (e) => {
        SetMessage(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message && message.trim().length > 0) {
                sendMessage(message.trim());
                SetMessage('');
            }
        }
    };

    useEffect(() => {
        // Scroll to the latest message whenever the messages array changes
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    //Resize input area based on text
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
    }, [message]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (friendsListRef.current && !friendsListRef.current.contains(event.target)) {
                setShowFriendsList(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [friendsListRef]);

    const toggleFriendsList = () => {
        setShowFriendsList(!showFriendsList);
        if (!showFriendsList) {
            fetchFriends();
        }
    };

    const addFriendToChat = async (friendId) => {
        try {
            await addUsersToRoom(roomId, [friendId]);
            setShowFriendsList(false);
        } catch (error) {
            console.error('Error adding friend to chat:', error);
        }
    };

    if (isLoading) {
        return <div>Loading messages...</div>;
    }

    return (
        <div className="chat-container">
            <div className="title-bar">
                <div className="user-info">
                    <span>Room ID: {roomId}</span>

                <div className="friends-dropdown" ref={friendsListRef}>
                    <button onClick={toggleFriendsList}>
                            <i className="fa-solid fa-user-plus"></i>
                    </button>
                
                
                {showFriendsList && (
                    <div className="friends-list">
                        <h3>Choose a friend to add:</h3>
                        {friends.map(friend => (
                            <div key={friend.FriendId} className="friend-item" onClick={(e) => {
                                e.stopPropagation();
                                addFriendToChat(friend.FriendId)
                            }}>
                                {friend.FriendUsername}
                            </div>
                        ))}
                    </div>
                    )}
                    </div>
                </div>
            </div>


            <div className="message-list">
                {messages && messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg?.SenderId === userId ? 'sent' : 'received'}`}>
                        <div className={`message-item`}>
                            <div className="message-info">
                                <div>
                                    <span className="sender">{msg?.Sender}</span>
                                    <span className="timestamp">{new Date(msg?.TimeStamp).toLocaleString()}</span>
                                </div>

                            </div>
                            <div className="chat-message"><span>{msg?.Message}</span></div>
                        </div>
                    </div>

                ))}

                <div ref={messageEndRef}></div>

            </div>

            <div className="chat-input-container">
                <textarea
                    ref={inputRef}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Type a message..."
                />
            </div>
        </div>
    );
}
export default ChatContainer;