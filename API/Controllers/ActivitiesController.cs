using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            this._context = context;

        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> getActivities() 
        {
            if (_context.Activities == null) {
                throw new Exception("_context.Activities == null");
            }
            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity?>> GetActivity(Guid id) 
        {
            if (_context.Activities == null) {
                throw new Exception("_context.Activities == null");
            }
            return await _context.Activities.FindAsync(id);
        }
    }
}