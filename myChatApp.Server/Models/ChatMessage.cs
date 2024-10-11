using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace myChatApp.Server.Models
{
    public class ChatMessage
    {
        [Key]
        public Guid MessageId { get; set; }
        public Guid? UserId { get; set; }
        public string Sender { get; set; }
        public Guid RoomId { get; set; }
        public string Message { get; set; }
        public DateTime TimeStamp { get; set; }

    }
}
