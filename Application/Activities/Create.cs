using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest {
            public Activity? Activity {get; set;}

            public class Handler : IRequestHandler<Command>
            {
                public DataContext _context { get; }
                public Handler(DataContext context)
                {
                    this._context = context;
                }

                public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                {
                    if ( _context.Activities == null || request.Activity == null) {
                        throw new Exception("null - exception Create.Handler.Handle");
                    }
                    _context.Activities.Add(request.Activity);
                    await _context.SaveChangesAsync();

                    return Unit.Value;
                }
            }
        }
    }
}