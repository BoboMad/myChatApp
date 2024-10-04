using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace myChatApp.Server.Models
{
    public class FriendRequest 
    {
        [Key]
        public Guid FriendRequestId { get; set; }   

        [Required]
        public Guid SenderId { get; set; }

        [ForeignKey("SenderId")]
        public ApplicationUser Sender { get; set; }

        [Required]
        public Guid ReceiverId { get; set; }

        [ForeignKey("ReceiverId")]
        public ApplicationUser Receiver { get; set; }

        public DateTime SentAt { get; set; }

        public bool IsAccepted { get; set; }
    }
}
