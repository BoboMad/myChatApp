using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using myChatApp.Server.Data.Contexts;
using myChatApp.Server.Models;

namespace myChatApp.Server.Services
{
    public class FriendService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public FriendService(ApplicationDbContext context ,UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        private async Task<ApplicationUser> GetUserByUsernameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task<bool> SendFriendRequest(string senderId, string receiverUsername)
        {
            var receiver = await _userManager.FindByNameAsync(receiverUsername);
            if (receiver == null)
            {
                return false;
            }

            bool requestExists = await _context.FriendRequests.AnyAsync(f => f.SenderId == senderId && f.ReceiverId== receiver.Id && !f.IsAccepted);

            if (requestExists)
            {
                return false;
            }

            var friendRequest = new FriendRequest
            {
                SenderId = senderId,
                ReceiverId = receiver.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.FriendRequests.Add(friendRequest);
            await _context.SaveChangesAsync();



            return true;
        }

        public async Task<bool> AcceptFriendRequest(Guid requestId)
        {
            var friendRequest = await _context.FriendRequests.FindAsync(requestId);
            if (friendRequest == null)
            {
                return false;
            }

            friendRequest.IsAccepted = true;

            var friendship = new FriendShip
            {
                UserId = friendRequest.SenderId,
                FriendId = friendRequest.ReceiverId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AddFriend(Guid userId, Guid friendId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            //if (user != null && !user.FriendIds.Contains(friendId))
            //{
            //    user.FriendIds.Add(friendId);
            //    await _userManager.UpdateAsync(user);
            //    return true;
            //}
            
            return false;
        }

        public async Task<bool> RemoveFriend(Guid userId, Guid friendId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            //if (user != null && user.FriendIds.Contains(friendId))
            //{
            //    user.FriendIds.Remove(friendId);
            //    await _userManager.UpdateAsync(user);
            //    return true;
            //}
            return false;
        }

        public async Task<bool> AlreadyFriends(string userId, string friendId)
        {
            return await _context.Friendships.AnyAsync(f =>
            (f.UserId == userId && f.FriendId == friendId) ||
            (f.UserId == friendId && f.FriendId == userId));
        }
    }
}
