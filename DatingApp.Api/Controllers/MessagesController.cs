using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dtos;
using DatingApp.Api.Helper;
using DatingApp.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/users/{userId}/[controller]")]
    public class MessagesController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id){
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                    return Unauthorized();
                }

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null){
                return NotFound();
            }

            return Ok(messageFromRepo);
        }

        [HttpGet("thread/{id}")]
        public async Task<IActionResult> GetMessagesThread(int userId, int id){
           if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                    return Unauthorized();
                }    
            
            var messagesFromRepo = await _repo.GetMessageThread(userId, id);

            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            return Ok(messageThread);
        }


        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, MessageParams messageParams){

              if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                    return Unauthorized();
                }

            var messageFromRepo = await _repo.GetMessagesForUser(messageParams);   

            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);

            Response.AddPagination(messageFromRepo.CurrentPage, messageFromRepo.PageSize,
            messageFromRepo.TotalCount, messageFromRepo.TotalPages);
            
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,
            [FromBody]MessageForCreationDto messageForCreationDto){
                if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                    return Unauthorized();
                }

                messageForCreationDto.SenderId = userId;

                var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

                if (recipient == null){
                    return BadRequest("Could not find user");
                }

                var message = _mapper.Map<Message>(messageForCreationDto);

                _repo.Add(message);

                var messageForReturn = _mapper.Map<MessageToReturnDto>(message);

                if (await _repo.SaveAll()){
                    return CreatedAtRoute("GetMessage", new {id = message.Id}, messageForReturn );
                }

                throw new Exception("Creating the message failed at save");
        }
    }
}