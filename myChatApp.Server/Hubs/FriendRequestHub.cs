using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace myChatApp.Server.Hubs
{
    public class FriendRequestHub : Hub
    {
        // Send friend request notification to specific client
        public async Task SendFriendRequestNotification(Guid reciverId, string senderUsername)
        {
            await Clients.User(reciverId.ToString()).SendAsync("ReceiveFriendRequest", senderUsername);
        }


        //Send accepted notification to specific client
        public async Task SendFriendRequestAcceptedNotification(Guid receiverId, string senderUsername)
        {
            await Clients.User(receiverId.ToString()).SendAsync("FriendRequestAccepted", senderUsername);
        }

        //When connecting
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            await base.OnConnectedAsync();
        }
    }
}
