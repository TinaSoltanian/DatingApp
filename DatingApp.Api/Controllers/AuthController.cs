using System.Threading.Tasks;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Model;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _repo;
        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }


        [HttpPost("register")]
        public  async Task<IActionResult> Register([FromBody]UserForRegisterDto userForRegisterDto){
            
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Username)){
                ModelState.AddModelError("Username", "Username is already taken!");
            }

            if (!ModelState.IsValid){
                return BadRequest(ModelState);
            }

            User user = new User(){
                 Username = userForRegisterDto.Username
            };

            var createdUSer = await _repo.RegisterAsync(user, userForRegisterDto.Password);

            return StatusCode(201);
        }
    }
}