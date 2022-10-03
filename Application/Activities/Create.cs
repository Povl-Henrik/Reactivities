using Application.Activities.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity? Activity { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            { 
                RuleFor(x => x.Activity!).SetValidator(new ActivityValidator()); // !? fordi activity kan være null, og det er vil Validator ikke håndtere??
            }
        }



        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            public DataContext _context { get; }
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (_context.Activities == null || request.Activity == null)
                {
                    throw new Exception("null - exception Create.Handler.Handle");
                }
                _context.Activities.Add(request.Activity);
                var result= await _context.SaveChangesAsync() > 0; // Returnerer antallet af skrevne entities.

                if (!result) {
                    return Result<Unit>.Failure("Failed to create Activity");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}