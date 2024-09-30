using Microsoft.AspNetCore.Identity;

namespace myChatApp.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<Guid> FriendIds { get; set; } = new List<Guid>();
    }
}
