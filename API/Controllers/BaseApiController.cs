using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // ie: controllernavnet er det f�r ordet Controller (c vs C ??)
    public class BaseApiController : ControllerBase
    {
        
    }
}