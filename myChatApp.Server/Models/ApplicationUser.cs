using Microsoft.AspNetCore.Identity;

namespace myChatApp.Server.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public ICollection<Friend> Friends { get; set; }
    }
}
