import React, { createContext, useContext, useState, useEffect } from 'react';
import { startConnection } from '../Services/SignalRServices';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const SignalRChatContext = createContext();

export const SignalRChatProvider = ({ children }) => {

    const { token, isAuthenticated, userId} = useContext(AuthContext);  
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const initiateConnection = async () => {
            const conn = await startConnection(token);
            setConnection(conn);
        };

        initiateConnection();
    }, [token, isAuthenticated]);

    useEffect(() => {
        if (!connection) return;

        connection.on('ReceiveMessage', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        connection.on('ReceiveRoomId', (roomId) => {
            console.log('Received Room ID:', roomId);
            setCurrentRoomId(roomId);
            navigate(`/me/chat/${roomId}`);
        })

        return () => {
            if (connection) {
                connection.off('ReceiveMessage');
                connection.off('ReceiveRoomId');
                connection.stop();
            }
        };
    }, [connection]);

    const JoinRoom = async (friendId) => {

        if (connection && connection.state === "Connected") {
            try {
                    await connection.invoke("JoinRoom", [friendId, userId]);
                }
             catch (error) {
                console.error("Failed to create or join room", error);
            }
        } else {
            console.error("SignalR connection is not established");
        }
    };


    const sendMessage = async (message) => {
        if (connection && connection.state === "Connected" && currentRoomId) {
            try {
                await connection.invoke("SendMessage", currentRoomId, message);
            } catch (error) {
                console.error("Failed to send message", error);
            }
        } else {
            console.error("Cannot send message: No active room or connection");
        }
    };

    const fetchChatMessagesForRoom = async () => {

        if (isAuthenticated) {

            try {
                const response = await fetch(`https://localhost:7292/api/ChatMessage/${currentRoomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setMessages(data.reverse());
            }
            catch (error) {
                console.error("Error fetching messages", error);
            }
        }
    };

    return (
        <SignalRChatContext.Provider value={{
            connection,
            sendMessage,
            fetchChatMessagesForRoom,
            JoinRoom,
            messages
            }}>
            {children}
        </SignalRChatContext.Provider>
    )
}