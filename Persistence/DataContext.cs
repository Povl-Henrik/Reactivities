using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity>? Activities { get; set; } // Udløser en tabel, der hedder Activities (EntityFramework)
    }
}