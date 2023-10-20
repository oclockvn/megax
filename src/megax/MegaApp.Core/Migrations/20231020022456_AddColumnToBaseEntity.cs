using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnToBaseEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ApprovedBy",
                table: "Leaves",
                newName: "ResponseBy");

            migrationBuilder.RenameColumn(
                name: "ApprovedAt",
                table: "Leaves",
                newName: "ResponseAt");

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "Users",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "Tasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedName",
                table: "Tasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "SubTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedName",
                table: "SubTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "Leaves",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResponseName",
                table: "Leaves",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedName",
                table: "Leaves",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "Files",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "FileReferences",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "DeviceHistories",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedName",
                table: "Clients",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "UpdatedName",
                table: "Tasks");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "SubTasks");

            migrationBuilder.DropColumn(
                name: "UpdatedName",
                table: "SubTasks");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "Leaves");

            migrationBuilder.DropColumn(
                name: "ResponseName",
                table: "Leaves");

            migrationBuilder.DropColumn(
                name: "UpdatedName",
                table: "Leaves");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "FileReferences");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "DeviceHistories");

            migrationBuilder.DropColumn(
                name: "CreatedName",
                table: "Clients");

            migrationBuilder.RenameColumn(
                name: "ResponseBy",
                table: "Leaves",
                newName: "ApprovedBy");

            migrationBuilder.RenameColumn(
                name: "ResponseAt",
                table: "Leaves",
                newName: "ApprovedAt");
        }
    }
}
