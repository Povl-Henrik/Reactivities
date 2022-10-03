using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity= await _context.Activities!.FindAsync(request.Id);

                if (activity == null) {
                    //return null!; // Det var det der null-check, han fjernede
                    // Hvorfor ikke? return Result<Unit>.Failure("Activity not found"); Eller flere tilstande i Result :-(
                }

                _context.Remove(activity!);

                bool result= await _context.SaveChangesAsync() > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Failed to delete the activity");

                //return Unit.Value; - tidligere
            }
        }
    }
}