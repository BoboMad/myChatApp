using myChatApp.Server.Models;

namespace myChatApp.Server.Services
{
    public class ChatRoomService
    {
        private readonly List<ChatRoom> _chatRooms = new();

        public ChatRoom CreateChatRoom(string name, List<Guid> userIds)
        {

            var chatRoom = new ChatRoom
            {
                Id = Guid.NewGuid(),
                Name = name,
                Users = userIds,
                CreationDate = DateTime.UtcNow
            };

            _chatRooms.Add(chatRoom);
            return chatRoom;
        }

        public List<ChatRoom> GetUserChatRooms(Guid userId)
        {
            return _chatRooms.Where(room => room.Users.Contains(userId)).ToList();
        }
    }
}
