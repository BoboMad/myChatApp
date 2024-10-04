using System.ComponentModel.DataAnnotations.Schema;

namespace myChatApp.Server.Models
{
    public class Friend
    {
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        public Guid FriendId { get; set; }

        [ForeignKey("FriendId")]
        public ApplicationUser FriendUser { get; set; }
    }
}
