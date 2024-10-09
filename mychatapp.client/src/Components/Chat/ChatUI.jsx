import { useRef, useEffect } from 'react';
import '../../assets/css/Chat.css';


const ChatUI = ({ messages, message, onInputChange, onKeyDown, CurrentUserId }) => {
    const messageEndRef = useRef(null);
    const inputRef = useRef(null);

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

    return (
        <div className="chat-container">
            <div className="title-bar">
                <div className="user-info">
                    <span>Friend username here</span>
                </div>
            </div>

            <div className="message-list">
                {messages && messages.map((msg, index) => (
                    <div key={index} className={`message-wrapper ${msg?.SenderId === CurrentUserId ? 'sent' : 'received'}`}>
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
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    rows={1}
                    placeholder="Type a message..."
                />
            </div>
        </div>
    );
        
}

export default ChatUI;