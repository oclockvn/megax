using MegaApp.Core.Services;
using System.ComponentModel.DataAnnotations;

namespace MegaApp.Core.Dtos;

public record DocumentModel
{
    public int Id { get; set; }

    [MaxLength(255)]
    public string DocumentType { get; set; } // CMND|CCCD
    public DateTimeOffset? IssueDate { get; set; } = null;

    [MaxLength(255)]
    public string DocumentNumber { get; set; }

    [MaxLength(255)]
    public string IssuePlace { get; set; }

    [MaxLength(255)]
    public string IssueBy { get; set; }

    public List<FileRecord> FileReferences { get; set; } = new();
    public List<FileRecord> FilesUpload { get; set; } = new();

    public DocumentModel()
    {

    }

    public DocumentModel(Core.Db.Entities.UserDocument document)
    {
        Id = document.Id;
        DocumentType = document.DocumentType;
        DocumentNumber = document.DocumentNumber;
        IssueDate = document.IssueDate;
        IssuePlace = document.IssuePlace;
        IssueBy = document.IssueBy;
    }
}
