using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]  // Activities
        public async Task<IActionResult> GetActivities(CancellationToken ct)
        {
            if (Mediator == null) {
                throw new Exception("Mediator is null, ActivitiesController.GetActivities");
            }
            return HandleResult<List<Activity>>(await Mediator.Send(new List.Query(), ct));
        }

        [HttpGet("{id}")] // activities/id
        public async Task<IActionResult> GetActivity(Guid id) // IActionResult i stedet for ActionResult<Activity> - så kan vi returnere HTTP-fejl
        {
            if (Mediator == null) { // Fra BaseApiController. I stedet for at checke for null, kan man skrive Mediator!.Send nedenfor.
                throw new Exception("Mediator is null, ActivitiesController.GetActivity");
            }
            return HandleResult<Activity>(await Mediator.Send(new Details.Query{Id = id})); // Men man behøver ikke skrive Activity, fordi det kan udledes af den faktiske parameter ???
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity([FromBody]Activity activity) // [FromBody] er default?
        {
            return HandleResult<Unit>(await Mediator!.Send(new Create.Command {Activity = activity}));
            // Men nu udl�ser min �stetiske sans s� en 'using MediatR;' ?? (Fordi jeg typer <Unit>)
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid Id, [FromBody]Activity activity)
        {
            activity.Id = Id;
            return HandleResult<Unit>(await Mediator!.Send(new Edit.Command {Activity = activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id) 
        {
            return HandleResult<Unit>(await Mediator!.Send(new Delete.Command{Id = id}));
        }
    }
}