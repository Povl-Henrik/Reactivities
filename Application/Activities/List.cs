using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>> {}

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                this._context = context;
                this.logger = logger;
            }

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (_context == null || _context.Activities == null) { // Det var det med, at han slog det null-check fra :-(
                    throw new Exception("List.Handle bad _context");
                }

                try 
                {
                    for (var i= 0; i < 0; i++) // For at skabe et delay, så man kan nå at afbryde i browser
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

                return Result<List<Activity>>.Success(await _context.Activities.ToListAsync(cancellationToken));
            }
        }
    }
}