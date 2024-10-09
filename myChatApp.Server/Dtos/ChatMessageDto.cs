using System.Text.Json.Serialization;

namespace myChatApp.Server.Dtos
{
    public class ChatMessageDto
    {
        [JsonPropertyName("MessageId")]
        public Guid MessageId { get; set; }
        
        [JsonPropertyName("RoomId")]
        public Guid RoomId { get; set; }

        [JsonPropertyName("Message")]
        public string Message { get; set; }

        [JsonPropertyName("Sender")]
        public string Sender { get; set; }

        [JsonPropertyName("SenderId")]
        public Guid SenderId { get; set; }

        [JsonPropertyName("TimeStamp")]
        public DateTime TimeStamp { get; set; }
    }
}
