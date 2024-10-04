namespace myChatApp.Server.Dtos
{
    public class FriendRequestDto
    {
        public Guid SenderUserId { get; set; }
        public Guid ReceiverUserId { get; set; }
        public string SenderUserName { get; set; }
        public string ReceiverUserName { get; set; }
        public DateTime SentAt { get; set; }
    }
}
