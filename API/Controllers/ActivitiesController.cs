using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        {
            if (Mediator == null) {
                throw new Exception("Mediator is null, ActivitiesController.GetActivities");
            }
            return await Mediator.Send(new List.Query(), ct);
        }

        [HttpGet("{id}")] // activities/id
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
        {
            if (Mediator == null) {
                throw new Exception("Mediator is null, ActivitiesController.GetActivity");
            }
            return await Mediator.Send(new Details.Query{Id = id});
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity([FromBody]Activity activity) // [FromBody] er default?
        {
            return Ok(await Mediator!.Send(new Create.Command {Activity = activity}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid Id, [FromBody]Activity activity)
        {
            activity.Id = Id;
            return Ok(await Mediator!.Send(new Edit.Command {Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) 
        {
            return Ok(await Mediator!.Send(new Delete.Command{Id = id}));
        }
    }
}