using System.ComponentModel.DataAnnotations;

namespace myChatApp.Server.Models
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public List<Guid> Users { get; set; }
        public DateTime CreationDate { get; set; }
        public bool IsGroupChat { get; set; }
    }
}
