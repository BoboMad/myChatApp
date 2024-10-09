import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../Contexts/AuthContext';
import { FriendRequestContext } from '../../Contexts/FriendRequestContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../assets/css/FriendRequest.css';


const FriendRequest = () => {

    const { token } = useContext(AuthContext);
    const { friendRequests, setFriendRequests } = useContext(FriendRequestContext);

    const handleAccept = async (requestId) => {

        try {
            const response = await fetch(`https://localhost:7292/api/Friend/acceptfriendrequest/${requestId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response) {
                throw new Error("Network response was not ok");
            }

            setFriendRequests((prevRequests) => prevRequests.filter(request => request.FriendRequestId !== requestId));

        }
        catch (error) {
            console.log(error);
        }
    }

    const handleDecline = async (requestId) => {
        try {
            const response = await fetch(`https://localhost:7292/api/Friend/declinefriendrequest/${requestId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response) {
                throw new Error("Network response was not ok");
            }

            setFriendRequests((prevRequests) => prevRequests.filter(request => request.FriendRequestId !== requestId));
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <div className="friend-request-wrapper">
            <h2>Friend requests</h2>
            {friendRequests.length === 0 ?
                (<p>No friend request at the moment.</p>)
                 :
                (
                    <ul>
                        {friendRequests && friendRequests.map(request => (
                            <li key={request.FriendRequestId}>
                                <div className="content-wrapper" >

                                    <div className="request-info">
                                        <div className="sender">{request.SenderUserName}</div>
                                        <div className="info">Incoming friend request</div>
                                    </div>

                                    <div className="button-wrapper">
                                        <button className="request-button" onClick={() => handleAccept(request.FriendRequestId)}>
                                         <i className="fas fa-check"></i>

                                        </button>

                                        <button
                                            className=" request-button"
                                            onClick={() => handleDecline(request.FriendRequestId)}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        )) }
                    </ul>
                ) 
            }
        </div>
        </>
    )
}

export default FriendRequest;