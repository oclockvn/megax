using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSupplier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Suppliers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone2",
                table: "Suppliers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "Phone2",
                table: "Suppliers");
        }
    }
}
