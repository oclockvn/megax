namespace MegaApp.Core.Exceptions;

public class EntityNotFoundException : Exception
{
    public EntityNotFoundException(string message) : base(message)
    {
    }
}

public class BusinessRuleViolationException : Exception
{
    public BusinessRuleViolationException(string message) : base(message)
    {

    }
}
