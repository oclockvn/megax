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
        }

        return string.IsNullOrWhiteSpace(error);
    }
}
