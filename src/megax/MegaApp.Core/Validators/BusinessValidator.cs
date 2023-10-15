namespace MegaApp.Core.Validators;

public abstract class BusinessValidator<T>
{
    protected T input;
    public BusinessValidator(T input)
    {
        this.input = input;
    }

    public abstract bool IsValid(out string error);
}
