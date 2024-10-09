import { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { startFriendRequestConnection } from '../Services/SignalRServices';
import { toast } from 'react-toastify';
export const FriendRequestContext = createContext();


export const FriendRequestProvider = ({ children }) => {

    const { token, isAuthenticated } = useContext(AuthContext);
    const [connection, setConnection] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const initiateConnection = async () => {
            const conn = await startFriendRequestConnection(token);
            setConnection(conn);
        };

        initiateConnection();
    }, [token, isAuthenticated]);


    useEffect(() => {
        if (!connection) return;

        connection.on('ReceiveFriendRequest', (friendRequest) => {
            setFriendRequests(prevFriendRequests => {
                if (!prevFriendRequests.some(req => req.FriendRequestId === friendRequest.FriendRequestId))

                    toast.info(`${friendRequest.SenderUserName} has sent you a friend request!`, {
                        position: 'bottom-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        pauseOnHover: true,
                        draggable: false,
                    });

                    return [...prevFriendRequests, friendRequest]
            });

        });

        connection.on('FriendRequestAccepted', (friendRequest) => {
            console.log('FriendRequestAccepted event triggered', friendRequest);
            toast.info(`${friendRequest.ReceiverUserName} has accepted your request!`, {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: false,
            });
        });

        return () => {
            if (connection) {
                connection.off('ReceiveFriendRequest');
                connection.off('FriendRequestAccepted');
                connection.stop();
            }
        };
    }, [connection]);

    const sendAcceptedRequest = async (receiverId, senderUsername) => {
        if (connection && connection.state === "Connected") {
            try {
                await connection.invoke("SendFriendRequestAcceptedNotification", receiverId, senderUsername);
            } catch (error) {
                console.error("Failed to send message", error);
            }
        } else {
            console.error("Cannot send message: No active room or connection");
        }
    };


    const fetchFriendRequests = async () => {
        try {
            const response = await fetch('https://localhost:7292/api/Friend/getfriendrequests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setFriendRequests(data);
        }
        catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, [setFriendRequests]);

    return (
        <FriendRequestContext.Provider value={{
            friendRequests,
            setFriendRequests,
            sendAcceptedRequest,
        }}>
            {children }
        </FriendRequestContext.Provider>
    )
}