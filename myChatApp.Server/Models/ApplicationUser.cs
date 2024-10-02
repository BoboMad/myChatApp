using Microsoft.AspNetCore.Identity;
using static myChatApp.Server.Models.FriendShip;

namespace myChatApp.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<FriendShip> Friends { get; set; }
    }
}
