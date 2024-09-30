using Microsoft.AspNetCore.Identity;
using myChatApp.Server.Models;

namespace myChatApp.Server.Services
{
    public class FriendService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public FriendService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> AddFriend(Guid userId, Guid friendId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user != null && !user.FriendIds.Contains(friendId))
            {
                user.FriendIds.Add(friendId);
                await _userManager.UpdateAsync(user);
                return true;
            }
            
            return false;
        }

        public async Task<bool> RemoveFriend(Guid userId, Guid friendId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user != null && user.FriendIds.Contains(friendId))
            {
                user.FriendIds.Remove(friendId);
                await _userManager.UpdateAsync(user);
                return true;
            }
            return false;
        }
    }
}
