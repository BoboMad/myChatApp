using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using myChatApp.Server.Dtos;
using System.Security.Claims;

namespace myChatApp.Server.Hubs
{
    [Authorize]
    public class FriendRequestHub : Hub
    {
        // Send friend request notification to specific client
        public async Task SendFriendRequestNotification(Guid reciverId, FriendRequestDto friendRequestDto)
        {
            await Clients.User(reciverId.ToString()).SendAsync("ReceiveFriendRequest", friendRequestDto);
        }


        //Send accepted notification to specific client
        public async Task SendFriendRequestAcceptedNotification(Guid receiverId, FriendRequestDto friendRequestDto)
        {
            await Clients.User(receiverId.ToString()).SendAsync("FriendRequestAccepted", friendRequestDto);
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
