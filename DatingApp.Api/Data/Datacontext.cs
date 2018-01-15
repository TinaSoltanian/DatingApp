using DatingApp.Api.Model;
using Microsoft.EntityFrameworkCore;


namespace DatingApp.Api.Data
{
    public class Datacontext : DbContext
    {
        public Datacontext(DbContextOptions<Datacontext> options) :
                                                         base(options){}

        public DbSet<Value> Values {get; set;}     
        public DbSet<User> Users { get; set; }   
        public DbSet<Photo> Photos { get; set; }                                                 
    }
}