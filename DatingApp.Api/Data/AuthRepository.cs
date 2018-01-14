using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DatingApp.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly Datacontext _context;
        public AuthRepository(Datacontext context)
        {
            _context = context;
        }

        public async Task<User> Login(string username, string password) 
        {

            User user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username.ToLower());

            if (user == null)
                return null;

            if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))             
                return null;

            // Auth successful
            return user;
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt)){
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for(int i = 0; i < computedHash.Length; i++){
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }

            return true;
        }

        public async Task<User> RegisterAsync(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePaswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePaswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512()){
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                passwordSalt = hmac.Key;
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync( x=> x.Username == username))
                return true;

            return false;    
        }
    }
}