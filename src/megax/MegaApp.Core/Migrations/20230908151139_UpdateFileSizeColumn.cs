using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFileSizeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileSizeKb",
                table: "Files");

            migrationBuilder.AddColumn<long>(
                name: "FileSize",
                table: "Files",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileSize",
                table: "Files");

            migrationBuilder.AddColumn<int>(
                name: "FileSizeKb",
                table: "Files",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
