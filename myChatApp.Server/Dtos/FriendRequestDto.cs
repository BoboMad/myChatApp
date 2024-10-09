using System.Text.Json.Serialization;

namespace myChatApp.Server.Dtos
{
    public class FriendRequestDto
    {
        [JsonPropertyName("FriendRequestId")] // Maintain PascalCase
        public Guid FriendRequestId { get; set; }

        [JsonPropertyName("SenderUserId")]
        public Guid SenderUserId { get; set; }

        [JsonPropertyName("ReceiverUserId")]
        public Guid ReceiverUserId { get; set; }

        [JsonPropertyName("SenderUserName")]
        public string SenderUserName { get; set; }

        [JsonPropertyName("ReceiverUserName")]
        public string ReceiverUserName { get; set; }

        [JsonPropertyName("SentAt")]
        public DateTime SentAt { get; set; }

    }
}
