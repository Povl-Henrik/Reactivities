using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query: IRequest<Activity> {
            public Guid Id { get; set;}
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            public Handler(DataContext context) {
                this._context = context;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                if (_context == null || _context.Activities == null) {
                    throw new Exception("_context null i Application.Activities.Handler.Handle");
                }
                var result= await _context.Activities.FindAsync(request.Id);

                if (result == null) {
                    throw new Exception("result null i Application.Activities.Handler.Handle");
                }
                return result;
            }
        }
    }
}