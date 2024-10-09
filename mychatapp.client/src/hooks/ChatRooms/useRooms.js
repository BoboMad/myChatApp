import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';

const useRooms = () => {
    const { token } = useContext(AuthContext);
    const [chatRooms, setChatRooms] = useState([]);

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
                setChatRooms(data);
            } else {
                console.error('Failed to fetch chat rooms');
            }
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, [token]);

    return { chatRooms, fetchChatRooms };
};

export default useRooms;