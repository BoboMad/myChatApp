using Microsoft.EntityFrameworkCore;
using myChatApp.Server.Data.Contexts;
using myChatApp.Server.Migrations;
using myChatApp.Server.Models;
using System.Text.RegularExpressions;

namespace myChatApp.Server.Services
{
    public class ChatRoomService
    {
        private readonly ApplicationDbContext _context;

        public ChatRoomService(ApplicationDbContext context)
        {
             _context = context;
        }

        public async Task<ChatRoom> CreateChatRoom(string name, List<Guid> userIds)
        {

            var chatRoom = new ChatRoom
            {
                Id = Guid.NewGuid(),
                Name = string.IsNullOrEmpty(name) ? "Privat chat" : name,
                Users = userIds.OrderBy(u => u).ToList(),
                CreationDate = DateTime.UtcNow,
                IsGroupChat = userIds.Count() > 2,
                
            };

            _context.ChatRooms.Add(chatRoom);
            await _context.SaveChangesAsync();
            return chatRoom;
        }


        public async Task<Guid> GetOrCreateRoom(List<Guid> userIds, Guid currentUserId)
        {
            try
            {
                if (!userIds.Contains(currentUserId))
                {
                    userIds.Add(currentUserId);
                }

                var sortedUserIds = userIds.OrderBy(u => u).ToList();
                var chatRoom = await ChatRoomAlreadyExists(sortedUserIds);

                if (chatRoom != null)
                {
                    return chatRoom.Id;
                }

                chatRoom = await CreateChatRoom(null, userIds);

                return chatRoom.Id;

            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in GetOrCreateRoom: {ex.Message}");
                Console.Error.WriteLine($"Stack Trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<ChatRoom?> ChatRoomAlreadyExists(List<Guid> userIds)
        {

            var potentialRooms = await _context.ChatRooms
              .Where(room => room.Users.Count == userIds.Count())
              .ToListAsync();

            // Is there already a chatroom with the same users?
            return potentialRooms.FirstOrDefault(r => r.Users.OrderBy(u => u).SequenceEqual(userIds.OrderBy(u => u)));
        }


        public async Task<List<ChatRoom>> GetUserChatRooms(Guid userId)
        {
            return await _context.ChatRooms
                .Where(room => room.Users.Contains(userId))
                .ToListAsync();

        }


        public async Task AddUsersToRoom(Guid roomId, List<Guid> newUserIds)
        {
            var room = await _context.ChatRooms.FindAsync(roomId);
            if (room == null)
            {
                throw new Exception("Room not found");
            }

            foreach (var userId in newUserIds)
            {
                if (!room.Users.Contains(userId))
                {
                    room.Users.Add(userId);
                }
            }

            room.IsGroupChat = room.Users.Count > 2;

            await _context.SaveChangesAsync();
        }

        public async Task<List<string?>> GetUsername(List<Guid> userIds)
        {
            return await _context.Users.Where(u => userIds.Contains(u.Id)).Select(u => u.UserName).ToListAsync();
        }
    }
}
