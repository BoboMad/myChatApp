using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using myChatApp.Server.Data.Contexts;
using myChatApp.Server.Dtos;
using myChatApp.Server.Services;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace myChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatMessageController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly ChatMessageService _chatMessageService;

        public ChatMessageController(ApplicationDbContext context, ChatMessageService chatMessageService)
        {
            _context = context;
            _chatMessageService = chatMessageService;
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> GetMessagesForRoom([FromRoute]Guid roomId)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var isUserInRoom = await _chatMessageService.IsUserInRoom(roomId,Guid.Parse(userId));

            if (!isUserInRoom)
            {
                return Forbid();
            }

            
            var chatMessageDtos = await _chatMessageService.GetChatMessagesForRoom(roomId);
            if (chatMessageDtos == null)
            {
                return NotFound();
            }

            return Ok(chatMessageDtos);
        }
    }
}
