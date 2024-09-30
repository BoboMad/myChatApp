using Microsoft.EntityFrameworkCore;

namespace myChatApp.Server.Data.Contexts
{
    public class ChatContext : DbContext
    {
        public ChatContext(DbContextOptions<ChatContext> options) : base(options)
        {
        }
    }
}
