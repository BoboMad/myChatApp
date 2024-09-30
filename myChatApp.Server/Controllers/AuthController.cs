using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using myChatApp.Server.Dtos;
using myChatApp.Server.Models;
using myChatApp.Server.Services;

namespace myChatApp.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtTokenService _jwtTokenService;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, JwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerRequest)
        {
            if (!ModelState.IsValid) 
            {
                return BadRequest("User could not be created, not a valid user");                
            }

            var user = new ApplicationUser
            {
                UserName = registerRequest.Username,
                Email = registerRequest.Email,
            };

            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (result.Succeeded)
            {
                return Ok("User was created");
            }

            return BadRequest("User could not be created");
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]  LoginDTO loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Could not login, bad login request");
            }

            var result = await _signInManager.PasswordSignInAsync(
                loginRequest.Username, 
                loginRequest.Password, 
                isPersistent: true, 
                lockoutOnFailure: true);

            if (result.Succeeded) 
            {
                var user = await _userManager.FindByNameAsync(loginRequest.Username);
                var token = _jwtTokenService.GenerateToken(user!);
                return Ok( new {Token = token});
            }

            return BadRequest("Could not login");

        }

    }
}
