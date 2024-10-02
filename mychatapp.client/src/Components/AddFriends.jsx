import {useState} from 'react'
import '../assets/css/AddFriend.css'

const AddFriends = () => {

    const [friendName, setFriendName] = useState("");

    const handleOnNameChange = (e) => {
        setFriendName(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(localStorage.getItem("jwtToken"));
        try {
            const response = await fetch('https://localhost:7292/api/friend/addfriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`, // Assuming the JWT is in localStorage
                },
                body: JSON.stringify(friendName), // Send the friendName as a string
            });

            const result = await response.text(); // Get the response text (could also use `json()` if your API returns JSON)

            if (response.ok) {
                console.log("User added!"); // Set success message
            } else {
                console.log("Failed to add user", result); // Set error message
            }
        } catch (error) {
            console.log("Error when adding user", error);
        }
    }


    return (
        <div className="addFriend-wrapper">
            <div className="addFriend-container">
                <form className="form" onSubmit={handleSubmit}>
                    <h2>Add Friend</h2>
                    <div className="info">You can add your friend with their username</div>

                    <div className="addFriend-input-container">
                        <input className="addFriendInput" value={friendName} onChange={handleOnNameChange} />

                        <div className="addFriend-button-container">
                            <button type="submit" className="custom-button" disabled={!friendName}>Send friend request</button>
                        </div>
                    </div>

                </form>
            </div>

            <div className="image-wrapper">
                <img src="../../public/addFriends.png" alt="" />
            </div>
        </div>
    )
}

export default AddFriends;