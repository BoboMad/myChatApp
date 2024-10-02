using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using myChatApp.Server.Models;

namespace myChatApp.Server.Data.Contexts
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<ApplicationUser> Users {  get; set; }

        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<FriendShip> Friendships { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FriendShip>()
               .HasOne(f => f.User)
               .WithMany(u => u.Friends)  // You can define a 'Friends' navigation property in ApplicationUser
               .HasForeignKey(f => f.UserId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<FriendShip>()
               .HasOne(f => f.Friend)
               .WithMany()  // You can also define 'FriendOf' navigation property if needed
               .HasForeignKey(f => f.FriendId)
               .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
