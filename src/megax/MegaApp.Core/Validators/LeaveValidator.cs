using MegaApp.Core.Dtos;

namespace MegaApp.Core.Validators;

public class LeaveRequestValidator : BusinessValidator<LeaveModel.Add>
{
    public LeaveRequestValidator(LeaveModel.Add input) : base(input)
    {
    }

    public override bool IsValid(out string error)
    {
        error = "";

        if (input.LeaveDates == null || input.LeaveDates.Count == 0)
        {
            error = "Requires at least 1 date leave";
        }
        else if (input.LeaveDates.Count > 5)
        {
            error = "Max 5 days is allowed per request";
        }
        else
        {
            var duplicatedDate = input.LeaveDates.GroupBy(x => x.Date.Date).Any(d => d.Count() > 1);
            if (duplicatedDate)
            {
                error = "Duplicated leave date found";
            }
            else // cross leave (past and future together)
            {
                var hasPast = input.LeaveDates.Any(d => d.Date < DateTimeOffset.Now);
                var hasFuture = input.LeaveDates.Any(d => d.Date >= DateTimeOffset.Now);
                if (hasPast && hasFuture)
                {
                    error = "Leave request with dates in past and future is not allowed";
                }

            }
        }

        return string.IsNullOrWhiteSpace(error);
    }
}
