import * as signalR from '@microsoft/signalR';


export const startConnection = async (token) => {

    //Build connection
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7292/chatHub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

    //Start connection
    try {
        await connection.start();
        console.log("SignalR Connected")
    }
    catch (error) {
        console.error("SignalR connection failed", error)
    }

    return connection;
}

export const startFriendRequestConnection = async (token) => {

    //Build connection
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7292/FriendRequestHub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

    //Start connection
    try {
        await connection.start();
        console.log("FriendRequestHub connected")
    }
    catch (error) {
        console.error("FriendRequestHub connection failed", error)
    }

    return connection;
}

