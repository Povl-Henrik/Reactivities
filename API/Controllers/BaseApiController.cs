using Application.Activities.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]  // Doing some magic with ModelState
    [Route("api/[controller]")] // ie: controllernavnet er det før ordet Controller (c vs C ??)
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;
        protected IMediator? Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();


        protected ActionResult HandleResult<T>(Result<T> result) {
            if (result == null) { // Det er altså ret grimt :-(
                return NotFound();
            } else if (result.isSuccess && result.Value != null) {
                return Ok(result.Value);
            } else if (result.isSuccess && result.Value == null) {
                return NotFound();
            } else {
                return BadRequest(result.Error);
            }
        }
    }
}