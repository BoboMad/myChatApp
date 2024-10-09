import '../../assets/css/FriendNavbar.css'

const FriendNavbar = ({ setSelectedComponent, selectedComponent }) => {

    return (
        <div className="friendNavbar-wrapper">
            <div className={`friends-tab ${selectedComponent === 'Friends' ? 'active' : ''}`}
                onClick={() =>  setSelectedComponent('Friends')}>
                Friends
            </div>

            <div className="devider"></div>

            <div className={`online-tab ${selectedComponent === 'FriendOnline' ? 'active' : ''}`}
                onClick={() => setSelectedComponent('FriendOnline')}>
                Online
            </div>

            <div className="devider"></div>

            <div className={`request-tab ${selectedComponent === 'FriendRequest' ? 'active' : ''}`}
                onClick={() => setSelectedComponent('FriendRequest')}>
                Requests
            </div>

            <div className="devider"></div>

            <div className={`add-friend-tab ${selectedComponent === 'AddFriends' ? 'active' : ''}`}
                onClick={() => { setSelectedComponent('AddFriends'); console.log(selectedComponent) }}>
                Add friends
            </div>
        </div>
    )
}

export default FriendNavbar;