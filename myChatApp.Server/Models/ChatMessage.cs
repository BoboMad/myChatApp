namespace myChatApp.Server.Models
{
    public class ChatMessage
    {
        public Guid Guid { get; set; }
        public Guid UserId { get; set; }
        public Guid RoomId { get; set; }
        public string Message { get; set; }
        public DateTime TimeStamp { get; set; }

    }
}
