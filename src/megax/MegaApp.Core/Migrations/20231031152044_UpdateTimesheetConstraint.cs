using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTimesheetConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Timesheets_Date",
                table: "Timesheets");

            migrationBuilder.DropIndex(
                name: "IX_Timesheets_UserId",
                table: "Timesheets");

            migrationBuilder.CreateIndex(
                name: "IX_Timesheets_UserId_Date",
                table: "Timesheets",
                columns: new[] { "UserId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Timesheets_UserId_Date",
                table: "Timesheets");

            migrationBuilder.CreateIndex(
                name: "IX_Timesheets_Date",
                table: "Timesheets",
                column: "Date",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Timesheets_UserId",
                table: "Timesheets",
                column: "UserId");
        }
    }
}
