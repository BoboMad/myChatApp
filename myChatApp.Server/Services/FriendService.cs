using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using myChatApp.Server.Data.Contexts;
using myChatApp.Server.Dtos;
using myChatApp.Server.Hubs;
using myChatApp.Server.Models;
using System.Security.Claims;

namespace myChatApp.Server.Services
{
    public class FriendService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<FriendRequestHub> _friendRequestHub;

        public FriendService(ApplicationDbContext context ,UserManager<ApplicationUser> userManager, IHubContext<FriendRequestHub> friendRequestHub)
        {
            _userManager = userManager;
            _context = context;
            _friendRequestHub = friendRequestHub;
        }

        private async Task<ApplicationUser> GetUserByUsernameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<bool> SendFriendRequest(Guid senderId, string receiverUsername)
        {
            var receiverUser = await GetUserByUsernameAsync(receiverUsername);

            if (receiverUser == null || receiverUser.Id == senderId)
            {
                return false;
            }

            var existingRequest = await _context.FriendRequests.FirstOrDefaultAsync(r => r.SenderId == senderId && r.ReceiverId == receiverUser.Id && !r.IsAccepted);
            if (existingRequest != null) 
            {
                return false;
            }

            var friendRequest = new FriendRequest
            {
                FriendRequestId = Guid.NewGuid(),
                SenderId = senderId,
                ReceiverId = receiverUser.Id,
                SentAt = DateTime.UtcNow,
                IsAccepted = false
            };

            _context.FriendRequests.Add(friendRequest);
            await _context.SaveChangesAsync();

            var senderUser = await _userManager.FindByIdAsync(senderId.ToString());

            var friendRequestDto = new FriendRequestDto
            {
                FriendRequestId = friendRequest.FriendRequestId,
                SenderUserId = friendRequest.SenderId,
                ReceiverUserId = friendRequest.ReceiverId,
                SenderUserName = friendRequest.Sender.UserName,
                ReceiverUserName = friendRequest.Receiver.UserName,
                SentAt = friendRequest.SentAt,
            };

            await _friendRequestHub.Clients.User(receiverUser.Id.ToString()).SendAsync("ReceiveFriendRequest", friendRequestDto);

            return true;
        }

        public async Task<bool> AcceptFriendRequest(Guid requestId)
        {
            var friendRequest = await _context.FriendRequests
                .Include(fr => fr.Receiver)
                .Include(fr => fr.Sender)
                .FirstOrDefaultAsync(fr => fr.FriendRequestId == requestId);

            if (friendRequest == null || friendRequest.IsAccepted)
            {
                return false;
            }

            friendRequest.IsAccepted = true;
            await _context.SaveChangesAsync();

            await AddFriend(friendRequest.SenderId, friendRequest.ReceiverId);

            var friendRequestDto = new FriendRequestDto
            {
                 FriendRequestId = friendRequest.FriendRequestId,
                 SenderUserId = friendRequest.SenderId,
                 ReceiverUserId = friendRequest.ReceiverId,
                 SenderUserName = friendRequest.Sender.UserName,
                 ReceiverUserName = friendRequest.Receiver.UserName,
                 SentAt = friendRequest.SentAt,
    };

            await _friendRequestHub.Clients.User(friendRequest.SenderId.ToString()).SendAsync("FriendRequestAccepted", friendRequestDto);

            return true;
        }

        public async Task<bool> DeclineFriendRequest(Guid requestId)
        {
            var request = await _context.FriendRequests.FindAsync(requestId);
            if (request == null)
            {
                return false;
            }

            _context.FriendRequests.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddFriend(Guid userId, Guid friendId)
        {
            var alreadyFriends = await _context.Friends.AnyAsync(f => (f.UserId == userId && f.FriendId == friendId) ||
                                                                      (f.UserId == friendId && f.FriendId == userId));
            if(alreadyFriends) 
            { 
                return false; 
            }

            var friendShip = new Friend
            {
                UserId = userId,
                FriendId = friendId,
            };

            _context.Friends.Add(friendShip);
            await _context.SaveChangesAsync();

            return false;
        }

        public async Task<bool> RemoveFriend(Guid userId, Guid friendId)
        {
            var friendShip = await _context.Friends.FirstOrDefaultAsync(f => (f.UserId == userId && f.FriendId == friendId) ||
                                                                       (f.UserId == friendId && f.FriendId == userId));

            if(friendShip == null)
            {
                return false;
            }

             _context.Friends.Remove(friendShip);
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<FriendRequestDto>> GetFriendRequests(Guid userId)
        {
            var friendRequests = await _context.FriendRequests
            .Include(r=>r.Sender)
            .Include(r=>r.Receiver)
            .Where(r => r.ReceiverId == userId && !r.IsAccepted)
            .Select(r => new FriendRequestDto
            {
                FriendRequestId = r.FriendRequestId,
                SenderUserId = r.SenderId,
                SenderUserName = r.Sender.UserName,
                ReceiverUserId = r.ReceiverId,
                ReceiverUserName = r.Receiver.UserName,
                SentAt = r.SentAt,
            })
                .ToListAsync();

            return friendRequests;

        }

        public async Task<List<FriendDto>> GetFriends(Guid userId)
        {
            var friends = await _context.Friends
                .Include(f => f.User)
                .Include(f => f.FriendUser)
                .Where(f => f.FriendId == userId || f.UserId == userId)
                .Select(f => new FriendDto
                {
                    FriendId = f.UserId == userId ? f.FriendId : f.UserId,
                    FriendUsername = f.UserId == userId ? f.FriendUser.UserName : f.User.UserName
                })
                .ToListAsync();

            return friends;
        }
    }
}
