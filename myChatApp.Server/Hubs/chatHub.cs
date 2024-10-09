using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using myChatApp.Server.Dtos;
using myChatApp.Server.Models;
using myChatApp.Server.Services;
using System.Security.Claims;

namespace myChatApp.Server.Hubs
{
    [Authorize]
    public class chatHub : Hub
    {
        private readonly ChatRoomService _chatRoomService;
        private readonly ChatMessageService _chatMessageService;

        public chatHub(ChatRoomService chatRoomService, ChatMessageService chatMessageService)
        {
            _chatRoomService = chatRoomService;
            _chatMessageService = chatMessageService;
        }

        private Guid GetUserIdFromToken()
        {
            // Get the UserId from the claims
            var userIdClaim = Context.User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                throw new Exception("User ID claim not found.");
            }
            return Guid.Parse(userIdClaim.Value);
        }

        public override async Task OnConnectedAsync()
        {

            try
            {
                var userId = GetUserIdFromToken();

                var rooms = await _chatRoomService.GetUserChatRooms(userId);

                foreach (var room in rooms)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, room.Id.ToString());
                }

                await base.OnConnectedAsync();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in OnConnectedAsync: {ex.Message}");
                throw;
            }
        }

        public async Task SendMessage(Guid roomId, string message)
        {
            var userId = GetUserIdFromToken();
            var chatMessage = new ChatMessage
            {
                MessageId = Guid.NewGuid(),
                RoomId = roomId,
                UserId = userId,
                Message = message,
                TimeStamp = DateTime.UtcNow
            };

            await _chatMessageService.SaveMessage(chatMessage);

            var chatMessageDto = await _chatMessageService.CreateChatMessageDto(chatMessage);

             await Clients.Group(roomId.ToString()).SendAsync("ReceiveMessage", chatMessageDto);
        }


        public async Task JoinRoom(List<Guid> userIds)
        {

            try
            {
                var currenUserId = GetUserIdFromToken();

                var chatRoomId = await _chatRoomService.GetOrCreateRoom(userIds, currenUserId);

                await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());

                await Clients.Caller.SendAsync("ReceiveRoomId", chatRoomId);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in CreateOrJoinRoom: {ex.Message}");
                Console.Error.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserIdFromToken();
            var rooms = await _chatRoomService.GetUserChatRooms(userId);

            foreach (var room in rooms)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, room.Id.ToString());
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
