using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query: IRequest<Result<Activity>> {
            public Guid Id { get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context) {
                this._context = context;
            }
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (_context == null || _context.Activities == null) {
                    throw new Exception("_context null i Application.Activities.Handler.Handle");
                }
                var activity= await _context.Activities.FindAsync(request.Id);

                //if (result == null) {
                //    throw new Exception("result null i Application.Activities.Handler.Handle");
                //}
                return Result<Activity>.Success(activity);
            }
        }
    }
}