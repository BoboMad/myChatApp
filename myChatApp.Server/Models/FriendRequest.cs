namespace myChatApp.Server.Models
{
    public class FriendRequest 
    { 
            public Guid Id { get; set; } = Guid.NewGuid();
            public string SenderId { get; set; }
            public string ReceiverId { get; set; }
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public bool IsAccepted { get; set; } = false;
    }
}
