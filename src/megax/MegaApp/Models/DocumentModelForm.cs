using MegaApp.Core.Dtos;

namespace MegaApp.Models;

public record DocumentModelForm : DocumentModel
{
    public IFormFile[] Files { get; set; }
}
