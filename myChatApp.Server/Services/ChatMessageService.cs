using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using myChatApp.Server.Data.Contexts;
using myChatApp.Server.Dtos;
using myChatApp.Server.Models;

namespace myChatApp.Server.Services
{
    public class ChatMessageService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatMessageService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<bool> IsUserInRoom(Guid roomId, Guid userId)
        {
            return await _context.ChatRooms
                .AnyAsync(cr => cr.Id == roomId && cr.Users.Any(u => u == userId));
        }

        public async Task<ChatMessageDto> CreateChatMessageDto(ChatMessage chatMessage)
        {
            var senderName = chatMessage.Sender;
            if(chatMessage.Sender != "system")
            {
             senderName = await _context.Users
                .Where(u => u.Id == chatMessage.UserId)
                .Select(u => u.UserName)
                .FirstOrDefaultAsync();

            }

            if (senderName == null)
            {
                throw new Exception($"User with Id {chatMessage.UserId} not found.");
            }

            return new ChatMessageDto
            {
                MessageId = chatMessage.MessageId,
                RoomId = chatMessage.RoomId,
                Message = chatMessage.Message,
                Sender = senderName,
                SenderId = chatMessage.UserId,
                TimeStamp = chatMessage.TimeStamp,
            };
        }

        public async Task<List<ChatMessageDto>> GetChatMessagesForRoom(Guid roomId)
        {

            var chatMessages = await _context.ChatMessages
                .Where(m => m.RoomId == roomId)
                .OrderByDescending(m => m.TimeStamp)
                .Take(50)
                .ToListAsync();

            var chatMessageDtos = new List<ChatMessageDto>();
            foreach (var chatMessage in chatMessages)
            {
                var chatMessageDto = await CreateChatMessageDto(chatMessage);
                chatMessageDtos.Add(chatMessageDto);
            }

            return chatMessageDtos;
        }

        public async Task SaveMessage(ChatMessage message)
        {
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetUsernameFromId(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            return user.UserName;
        }
    }
}
