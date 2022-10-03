using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity? Activity { get; set; }

        }

        
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            { 
                RuleFor(x => x.Activity!).SetValidator(new ActivityValidator()); 
            }
        }



        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this._context = context;
                this._mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity= await _context.Activities!.FindAsync(request.Activity!.Id);

                if (activity == null) {
                    return null!; // Det er altså ret grimt. Der kunne være en Result<Unit>.NotFound(id);
                }

                _mapper.Map(request.Activity, activity);

                // activity!.Title= request.Activity.Title ?? activity.Title;

                int numChanges= await _context.SaveChangesAsync(); // number of changes
                bool result= numChanges > 0;

                return result
                       ? Result<Unit>.Success(Unit.Value)
                       : Result<Unit>.Failure("Failed to update.");
            }
        }
    }
}