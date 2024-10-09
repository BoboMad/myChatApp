using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using myChatApp.Server.Data.Contexts;
using myChatApp.Server.Dtos;
using myChatApp.Server.Hubs;
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
        private readonly ApplicationDbContext _context;

        public FriendController(FriendService friendService, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _friendService = friendService;
            _userManager = userManager;
            _context = context;
        }

        [Authorize]
        [HttpPost("sendfriendrequest")]
        public async Task<IActionResult> SendFriendRequest([FromBody] string receiverUsername)
        {
            var senderIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (senderIdClaim == null || String.IsNullOrEmpty(receiverUsername))
            {
                return BadRequest("Sender/receiver user not found.");
            }

            var senderId = Guid.Parse(senderIdClaim.Value);

            var result = await _friendService.SendFriendRequest(senderId, receiverUsername);

            if (!result)
            {
                return BadRequest("Friend request could not be sent or already exist");
            }

            return Ok("Friend request sent successfully.");
        }

        [Authorize]
        [HttpPost("acceptfriendrequest/{requestId}")]
        public async Task<IActionResult> AcceptFriendRequest(Guid requestId)
        {

            var result = await _friendService.AcceptFriendRequest(requestId);
            if (!result)
            {
                return BadRequest("Friend request could not be accepted");
            }

            return Ok("Friend request accepted successfully.");
        }

        [Authorize]
        [HttpPost("declinefriendrequest/{requestId}")]
        public async Task<IActionResult> DeclineFriendRequest(Guid requestId)
        {
            var result = await _friendService.DeclineFriendRequest(requestId);
            if (!result)
            {
                return BadRequest("Friend request could not be declined");
            }

            return Ok("Friend request declined successfully.");
        }

        [Authorize]
        [HttpGet("getfriendrequests")]
        public async Task<IActionResult> GetFriendRequests()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return BadRequest("User not found.");
            }

            var userId = Guid.Parse(userIdClaim.Value);

            var friendRequests = await _friendService.GetFriendRequests(userId);
            return Ok(friendRequests);
        }


        [Authorize]
        [HttpGet("getfriends")]
        public async Task<IActionResult> GetFriends()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if(userIdClaim == null)
            {
                return BadRequest("User not found.");
            }

            var userId = Guid.Parse(userIdClaim.Value);

            var friends = await _friendService.GetFriends(userId);
            return Ok(friends);
        }

        [Authorize]
        [HttpDelete()]
        public async Task<IActionResult> RemoveFriend()
        {
            return Ok("");
        }
    }
}
