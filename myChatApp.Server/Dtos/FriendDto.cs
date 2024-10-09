using System.Text.Json.Serialization;

namespace myChatApp.Server.Dtos
{
    public class FriendDto
    {
        [JsonPropertyName("FriendId")]
        public Guid FriendId { get; set; }

        [JsonPropertyName("FriendUsername")]
        public string FriendUsername { get; set; }
    }
}
