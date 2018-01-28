using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.Api.Helper;
using DatingApp.Api.Model;

namespace DatingApp.Api.Data
{
    public interface IDatingRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;

         Task<bool> SaveAll();

         Task<PagedList<User>> GetUsers(UserParams userParams);

         Task<User> GetUser(int Id);
         
         Task<Photo> GetPhoto(int Id);

         Task<Photo> GetMainPhoto(int userId);

         Task<Like> GetLike(int userId, int recipientId);
    }
}