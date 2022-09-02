using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                this._context = context;
                this.logger = logger;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (_context == null || _context.Activities == null) {
                    throw new Exception("List.Handle bad _context");
                }

                try 
                {
                    for (var i= 0; i < 0; i++) 
                    {
                      cancellationToken.ThrowIfCancellationRequested();
                      await Task.Delay(1000, cancellationToken);
                      logger.LogInformation($"Task {i} has completed");
                    }
                } catch (Exception ex) when (ex is TaskCanceledException)
                {
                    logger.LogInformation("Task was cancelled " ); 
                    // Ikke '+ ex.ToString());', nu bliver ex jo checket og altså brugt
                }
                return await _context.Activities.ToListAsync(cancellationToken);
            }
        }
    }
}