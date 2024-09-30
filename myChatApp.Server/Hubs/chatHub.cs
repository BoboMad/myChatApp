using Microsoft.AspNetCore.SignalR;
using myChatApp.Server.Models;
using myChatApp.Server.Services;
using System.Security.Claims;

namespace myChatApp.Server.Hubs
{
    public class chatHub : Hub
    {
        private readonly ChatRoomService _chatRoomService;

        public chatHub(ChatRoomService chatRoomService)
        {
            _chatRoomService = chatRoomService;
        }

        private Guid GetUserIdFromToken()
        {
            // Get the UserId from the claims
            var userIdClaim = Context.User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdClaim.Value);
        }

        public async Task SendMessage(Guid roomId, string message)
        {
            var userId = GetUserIdFromToken();
            var chatMessage = new ChatMessage
            {
                Guid = Guid.NewGuid(),
                UserId = userId,
                Message = message,
                TimeStamp = DateTime.UtcNow
            };

            await Clients.Group(roomId.ToString()).SendAsync("ReceiveMessage", chatMessage);
        }

    }
}
