using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using myChatApp.Server.Models;
using myChatApp.Server.Services;
using System.Security.Claims;

namespace myChatApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class FriendController : ControllerBase
    {
        private readonly FriendService _friendService;
        private readonly UserManager<ApplicationUser> _userManager;

        public FriendController(FriendService friendService, UserManager<ApplicationUser> userManager)
        {
            _friendService = friendService;
            _userManager = userManager;
        }

        private Guid GetUserIdFromToken()
        {
            // Get the UserId from the claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return Guid.Parse(userIdClaim.Value);
        }

        [Authorize]
        [Authorize]
        [HttpPost("sendfriendrequest")]
        public async Task<IActionResult> SendFriendRequest([FromBody] string receiverUsername)
        {
            var senderId = User.FindFirst(ClaimTypes.NameIdentifier).Value;

            var result = await _friendService.SendFriendRequest(senderId, receiverUsername);
            if (result)
            {
                return Ok("Friend request sent successfully.");
            }

            return BadRequest("Friend request could not be sent or already exists.");
        }

        [Authorize]
        [HttpPost("acceptfriendrequest/{requestId}")]
        public async Task<IActionResult> AcceptFriendRequest(Guid requestId)
        {
            var result = await _friendService.AcceptFriendRequest(requestId);
            if (result)
            {
                return Ok("Friend request accepted.");
            }

            return BadRequest("Friend request could not be accepted.");
        }

        [Authorize]
        [HttpPost("addfriend")]
        public async Task<IActionResult> AddFriend([FromBody] string friendUsername)
        {


            var friend = await _userManager.FindByNameAsync(friendUsername);
            if (friend == null) 
            {
                return NotFound($"User with username {friendUsername} was not found");
            }

            var userId = GetUserIdFromToken();
            var friendId = friend.Id;
            var result = await _friendService.AddFriend(userId, Guid.Parse(friendId));

            if (result)
                return Ok("Friend added successfully.");

            return BadRequest("Could not add friend.");
        }

    }
}
