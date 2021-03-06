using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Helper;
using DatingApp.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    public class PhotoController : Controller
    {
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        private readonly IDatingRepository _repo;
        private Cloudinary _cloudinary;

        public PhotoController(IDatingRepository repo, 
                               IMapper mapper, 
                               IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("id", Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id){
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photoDto){
            var user = await _repo.GetUser(userId);

            if (user == null){
                return BadRequest("Couldn't find user");
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (user.Id != currentUserId){
                return Unauthorized();
            }

            var file = photoDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0){
                using (var stream = file.OpenReadStream()){
                    var uploadParams = new ImageUploadParams(){
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoDto.url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoDto);
            photo.User = user;

            if (!user.Photos.Any(p => p.IsMain)){
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _repo.SaveAll()){
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id}, photoToReturn);
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("{id}/setMain")]
        public async Task<IActionResult> SetMainphoto(int userId, int id){
            if (userId != int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value )){
                return Unauthorized();
            }

            var photoFromRepo = await _repo.GetPhoto(id);
            if (photoFromRepo == null){
                return NotFound();
            }

            if (photoFromRepo.IsMain){
                return BadRequest("This is already the main photo");
            }

            var currentMainPhoto = await _repo.GetMainPhoto(userId);
            if (currentMainPhoto != null)
                currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if( await _repo.SaveAll()) {
                return NoContent();
            }

            return BadRequest("Could not set photo to remain");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id){
            if (userId != int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value )){
                return Unauthorized();
            }

            var photoFromRepo = await _repo.GetPhoto(id);
            if (photoFromRepo == null){
                return NotFound();
            }

            if (photoFromRepo.IsMain){
                return BadRequest("You can not delete the main photo");
            }

            if (photoFromRepo.PublicId != null){
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok"){
                    _repo.Delete(photoFromRepo);
                }                
            }

            if (photoFromRepo.PublicId == null){
                _repo.Delete(photoFromRepo);
            }

            if(await _repo.SaveAll()){
                return Ok();
            }

             return BadRequest("Faild to delete the photo");   
        }
        
    }
}