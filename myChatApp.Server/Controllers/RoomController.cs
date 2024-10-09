using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using myChatApp.Server.Services;
using System.Security.Claims;

namespace myChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoomController : ControllerBase
    {

        private readonly ChatRoomService _roomService;

        public RoomController(ChatRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRooms()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var chatRooms = await _roomService.GetUserChatRooms(Guid.Parse(userId));

            return Ok(chatRooms);
        }

    }
}
