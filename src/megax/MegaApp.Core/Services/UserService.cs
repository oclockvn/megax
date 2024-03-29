﻿using MegaApp.Core.Db;
using MegaApp.Core.Dtos;
using MegaApp.Utils.Extensions;
using Microsoft.EntityFrameworkCore;
using MegaApp.Core.Db.Entities;
using MegaApp.Core.Exceptions;

namespace MegaApp.Core.Services;

public interface IUserService
{
    Task<UserModel.Slim> GetUserSlimAsync(int id);
    Task<UserModel> GetUserAsync(int id);
    Task<UserModel> GetUserAsync(string username);
    Task<PagedResult<UserModel>> GetUsersAsync(Filter filter);
    Task<UserCard> GetUserCardAsync(int id);

    Task<Result<int>> CreateUserAsync(UserModel.NewUser user);
    Task<Result<int>> UpdateUserDetailAsync(int id, UserUpdateModel req);

    Task<Result<UserDeviceRecord>> AssignDeviceAsync(int id, int deviceId);
    Task<Result<bool>> ReturnDeviceAsync(int id, int deviceId);
    Task<List<UserDeviceRecord>> UserDevicesAsync(int id);

    Task<Result<ContactModel>> CreateUpdateContactAsync(int userId, ContactModel req);
    Task<Result<bool>> DeleteContactAsync(int contactId);

    Task<Result<DocumentModel>> CreateUpdateDocumentAsync(int userId, DocumentModel req);
    Task<Result<bool>> DeleteDocumentAsync(int documentId);
}

internal class UserService : IUserService
{
    private readonly ApplicationDbContextFactory dbContextFactory;
    private readonly IFileService fileService;

    public UserService(ApplicationDbContextFactory dbContextFactory, IFileService fileService)
    {
        this.dbContextFactory = dbContextFactory;
        this.fileService = fileService;
    }

    private ApplicationDbContext UseDb() => dbContextFactory.CreateDbContext();

    public async Task<UserModel> GetUserAsync(int id)
    {
        using var db = UseDb();
        var user = await db.Users.Where(u => u.Id == id)
            .Select(u => new UserModel(u)
            {
                AccountId = u.Accounts.Select(a => a.Id).FirstOrDefault(),
                Contacts = u.Contacts.Select(c => new ContactModel
                {
                    Id = c.Id,
                    Address = c.Address,
                    Dob = c.Dob,
                    Name = c.Name,
                    Email = c.Email,
                    IsPrimaryContact = c.IsPrimaryContact,
                    Phone = c.Phone,
                    Relationship = c.Relationship
                }).ToList(),
                Documents = u.Documents.Select(d => new DocumentModel
                {
                    Id = d.Id,
                    DocumentNumber = d.DocumentNumber,
                    DocumentType = d.DocumentType,
                    IssueBy = d.IssueBy,
                    IssueDate = d.IssueDate,
                    IssuePlace = d.IssuePlace,
                }).ToList(),
                Roles = u.Roles.Select(r => new UserRoleModel(r.RoleId, "")).ToArray()
            })
            .FirstOrDefaultAsync();

        var documentIds = user.Documents?.Select(x => x.Id.ToString()).ToArray();
        var files = await fileService.GetFilesAsync(documentIds, Enums.FileType.UserDocument);
        if (files.Count > 0)
        {
            foreach (var doc in user.Documents)
            {
                doc.FileReferences = files.Where(f => f.RefId == doc.Id.ToString()).ToList();
            }
        }

        return user;
    }

    public async Task<UserModel.Slim> GetUserSlimAsync(int id)
    {
        using var db = UseDb();
        return await db.Accounts.Where(a => a.UserId == id)
            .Select(a => new UserModel.Slim
            {
                Id = a.UserId,
                AccountId = a.Id,
                Email = a.User.Email,
                FullName = a.User.FullName,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Result<int>> CreateUserAsync(UserModel.NewUser user)
    {
        using var db = UseDb();
        var userExist = await db.Users.Where(u => u.Accounts.Any(a => a.Username == user.Username)).AnyAsync();
        if (userExist)
        {
            return Result<int>.Fail(Result.USER_ALREADY_EXIST);
        }

        var entity = db.Users.Add(new()
        {
            FullName = user.FullName,
            Email = user.Email,
            Title = user.Title,
            CreatedAt = DateTimeOffset.Now,
            Dob = user.Dob,
            Phone = user.Phone,
            Address = user.Address,
            IdentityNumber = user.IdentityNumber,
        }).Entity;

        // generate random pw if doesn't specify one
        if (string.IsNullOrEmpty(user.Password))
        {
            user.Password = Guid.NewGuid().ToString("N");
        }

        // add account to user
        entity.Accounts.Add(new Db.Entities.Account
        {
            Username = user.Username,
            Password = user.Password.Hash(),
            OAuthType = user.OAuthType,
            Provider = user.ProviderType,
        });

        await db.SaveChangesAsync();

        return Result<int>.Ok(entity.Id);
    }

    public async Task<Result<int>> UpdateUserDetailAsync(int id, UserUpdateModel req)
    {
        using var db = UseDb();
        var user = await db.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

        if (user == null)
        {
            return Result<int>.Fail(Result.USER_DOES_NOT_EXIST);
        }

        if (await db.Users.AnyAsync(u => u.Id != id && u.Code == req.Code))
        {
            return Result<int>.Fail(Result.USER_CODE_ALREADY_EXIST);
        }

        // user.Id = req.Id;
        user.Code = req.Code;
        // user.Email = req.Email;
        user.FullName = req.FullName;
        user.Title = req.Title;
        user.Nickname = req.Nickname;
        user.Phone = req.Phone;
        user.Address = req.Address;
        user.PermanentResidence = req.PermanentResidence;
        user.Nationality = req.Nationality;
        user.Dob = req.Dob;
        user.IdentityNumber = req.IdentityNumber;
        user.Role = req.Role;
        user.WorkingType = req.WorkingType;
        user.Gender = req.Gender;
        user.PersonalEmail = req.PersonalEmail;
        user.Hometown = req.Hometown;
        user.BirthPlace = req.BirthPlace;
        user.Nation = req.Nation;
        user.Religion = req.Religion;
        user.TaxNumber = req.TaxNumber;
        user.InsuranceNumber = req.InsuranceNumber;
        user.Married = req.Married;
        user.AcademicLevel = req.AcademicLevel;
        user.University = req.University;
        user.Major = req.Major;
        // user.VehicleType = req.VehicleType;
        // user.VehicleBrand = req.VehicleBrand;
        // user.VehicleColor = req.VehicleColor;
        // user.VehiclePlateNumber = req.VehiclePlateNumber;
        user.BankAccountNumber = req.BankAccountNumber;
        user.BankBranch = req.BankBranch;
        user.BankId = req.BankId;
        user.ContractStart = req.ContractStart;
        user.ContractEnd = req.ContractEnd;
        user.ContractType = req.ContractType;
        // user.TeamId = req.TeamId;

        await db.SaveChangesAsync();

        return Result<int>.Ok(user.Id);
    }

    public async Task<UserModel> GetUserAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentNullException(nameof(username));

        using var db = UseDb();
        var user = await db.Accounts.Where(a => a.Username == username)
            .Select(a => new UserModel(a.User))
            .FirstOrDefaultAsync();

        return user;
    }

    public async Task<PagedResult<UserModel>> GetUsersAsync(Filter filter)
    {
        using var db = UseDb();
        var query = db.Users
            .OrderByDescending(x => x.Id)
            .Filter(filter?.Query);

        if (!string.IsNullOrWhiteSpace(filter?.SortBy))
        {
            var isAsc = filter.IsAsc;
            query = filter.SortBy.ToLower() switch
            {
                "email" => query.Sort(x => x.Email, isAsc),
                "fullname" => query.Sort(x => x.FullName, isAsc),
                "dob" => query.Sort(x => x.Dob, isAsc),
                "phone" => query.Sort(x => x.Phone, isAsc),
                _ => query.Sort(x => x.Id, isAsc)
            };
        }

        var total = await query.CountAsync();

        var items = await query
        .Paging(filter.Page, filter.PageSize)
        .Select(x => new UserModel(x)).ToListAsync();

        return new PagedResult<UserModel>(items, filter.Page, total);
    }

    public async Task<Result<UserDeviceRecord>> AssignDeviceAsync(int id, int deviceId)
    {
        using var db = UseDb();
        var device = await db.Devices.Where(d => d.Id == deviceId)
            .Select(x => new { x.Disabled, IsOccupied = x.Histories.Any(h => h.ReturnedAt == null) })
            .FirstOrDefaultAsync() ?? throw new BusinessRuleViolationException("Never fucking happen");

        if (device.Disabled)
        {
            return Result<UserDeviceRecord>.Fail(Result.DEVICE_IS_DISABLED);
        }

        if (device.IsOccupied)
        {
            return Result<UserDeviceRecord>.Fail(Result.DEVICE_IS_UNAVAILABLE);
        }

        db.DeviceHistories.Add(new DeviceHistory
        {
            DeviceId = deviceId,
            UserId = id,
            CreatedAt = DateTimeOffset.Now,
            TakenAt = DateTimeOffset.Now,
        });

        await db.SaveChangesAsync();

        var owner = await db.DeviceHistories
            .Where(d => d.DeviceId == deviceId && d.UserId == id)
            .Where(d => d.ReturnedAt == null)
            .Select(x => new UserDeviceRecord(x.DeviceId, x.Device.Name, x.Device.SerialNumber, x.Device.DeviceType.Name, x.TakenAt, x.ReturnedAt))
            .SingleOrDefaultAsync();

        return new Result<UserDeviceRecord>(owner);
    }

    public async Task<Result<bool>> ReturnDeviceAsync(int id, int deviceId)
    {
        using var db = UseDb();
        var deviceHistory = await db.DeviceHistories.Where(d => d.DeviceId == deviceId && d.UserId == id)
            .FirstOrDefaultAsync() ?? throw new BusinessRuleViolationException("Never fucking happen");

        if (deviceHistory.ReturnedAt != null)
        {
            return Result<bool>.Fail(Result.DEVICE_ALREADY_IN_STOCK);
        }

        deviceHistory.ReturnedAt = DateTimeOffset.Now;

        await db.SaveChangesAsync();
        return new Result<bool>(true);
    }

    public async Task<List<UserDeviceRecord>> UserDevicesAsync(int id)
    {
        using var db = UseDb();
        var devices = await db.DeviceHistories
            .OrderByDescending(x => x.Id)
            .Where(x => x.UserId == id)
            .Select(x => new UserDeviceRecord(x.DeviceId, x.Device.Name, x.Device.SerialNumber, x.Device.DeviceType.Name, x.TakenAt, x.ReturnedAt))
            .ToListAsync();

        var active = devices.Where(d => d.ReturnedAt == null).ToList();
        var returned = devices.Where(d => d.ReturnedAt != null).ToList();

        active.AddRange(returned);

        return active;
    }

    public async Task<Result<ContactModel>> CreateUpdateContactAsync(int userId, ContactModel req)
    {
        using var db = UseDb();
        Contact contact;
        if (req.Id > 0)
        {
            contact = await db.Contacts.FirstOrDefaultAsync(c => c.Id == req.Id);
            if (contact == null)
            {
                throw new EntityNotFoundException($"Contact {req.Id} could not be found");
            }

            contact.IsPrimaryContact = req.IsPrimaryContact;
            contact.Name = req.Name;
            contact.Email = req.Email;
            contact.Phone = req.Phone;
            contact.Relationship = req.Relationship;
            contact.Dob = req.Dob;
            contact.Address = req.Address;
        }
        else
        {
            // if this is the very first contact of the user, set it to primary anyway
            var shouldBePrimary = req.IsPrimaryContact || !await db.Contacts.AnyAsync(c => c.UserId == userId);
            contact = db.Contacts.Add(new Contact
            {
                IsPrimaryContact = shouldBePrimary,
                Name = req.Name,
                Email = req.Email,
                Phone = req.Phone,
                Address = req.Address,
                Dob = req.Dob,
                Id = 0,
                Relationship = req.Relationship,
                UserId = userId,
            }).Entity;
        }

        await db.SaveChangesAsync();

        var switchPrimaryContact = contact.IsPrimaryContact && await db.Contacts.Where(c => c.Id != contact.Id && c.IsPrimaryContact).AnyAsync();
        if (switchPrimaryContact)
        {
            // remove primary from other contacts of this user
            await db.Contacts
                .Where(c => c.UserId == userId && c.Id != contact.Id && c.IsPrimaryContact)
                .ExecuteUpdateAsync(c => c.SetProperty(c => c.IsPrimaryContact, false));
        }

        return new Result<ContactModel>(new ContactModel(contact));
    }

    public async Task<Result<bool>> DeleteContactAsync(int contactId)
    {
        using var db = UseDb();
        await db.Contacts.Where(c => c.Id == contactId).ExecuteDeleteAsync();

        return new Result<bool>(true);
    }

    public async Task<Result<DocumentModel>> CreateUpdateDocumentAsync(int userId, DocumentModel req)
    {
        using var db = UseDb();
        UserDocument document;
        if (req.Id > 0)
        {
            document = await db.UserDocuments.FirstOrDefaultAsync(c => c.Id == req.Id);
            if (document == null)
            {
                throw new EntityNotFoundException($"Document {req.Id} could not be found");
            }

            document.DocumentNumber = req.DocumentNumber;
            document.DocumentType = req.DocumentType;
            document.IssueDate = req.IssueDate;
            document.IssuePlace = req.IssuePlace;
            document.IssueBy = req.IssueBy;
        }
        else
        {
            document = db.UserDocuments.Add(new UserDocument
            {
                Id = 0,
                DocumentNumber = req.DocumentNumber,
                DocumentType = req.DocumentType,
                IssueDate = req.IssueDate,
                IssuePlace = req.IssuePlace,
                IssueBy = req.IssueBy,
                UserId = userId,
            }).Entity;
        }

        await db.SaveChangesAsync();

        // upload file
        if (req.FilesUpload?.Count > 0)
        {
            await fileService.AddFilesAsync(document.Id.ToString(), Enums.FileType.UserDocument, req.FilesUpload);
        }

        // reload files
        var files = await fileService.GetFilesAsync(document.Id.ToString(), Enums.FileType.UserDocument);
        var result = new DocumentModel(document) { FileReferences = files };
        return new Result<DocumentModel>(result);
    }

    public async Task<Result<bool>> DeleteDocumentAsync(int documentId)
    {
        using var db = UseDb();
        await db.UserDocuments.Where(d => d.Id == documentId).ExecuteDeleteAsync();

        // todo: remove file

        return new Result<bool>(true);
    }

    public async Task<UserCard> GetUserCardAsync(int id)
    {
        using var db = UseDb();
        var user = await db.Users.Where(x => x.Id == id)
        .Select(x => new UserCard
        {
            Id = id,
            FullName = x.FullName,
            Title = x.Title,
            Phone = x.Phone,
            Email = x.Email,
        })
        .FirstOrDefaultAsync() ?? throw new EntityNotFoundException($"User id {id} could not be found");

        var leaves = await db.LeaveDates.Where(l => l.Leave.UserId == id)
        .Select(x => new
        {
            x.Date,
            x.Time,
            x.Leave.Status,
            x.Leave.Type,
        })
        .ToListAsync();

        user.TotalAnnual = 15; // todo: get annual from db
        // note: any past leaves are taken
        user.TakenAnnual = leaves
            .Where(x => x.Date.Date <= DateTimeOffset.Now.Date && x.Type == Enums.LeaveType.Annual)
            .Sum(x => x.Time == Enums.LeaveTime.All ? 2 : 1) / 2;

        user.TakenPaidLeave = leaves
            .Where(x => x.Date.Date <= DateTimeOffset.Now.Date && x.Type == Enums.LeaveType.Paid)
            .Sum(x => x.Time == Enums.LeaveTime.All ? 2 : 1) / 2;

        return user;
    }
}
