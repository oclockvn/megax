using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddTimesheetWeek : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int?>(
                name: "Week",
                table: "Timesheets",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.Sql("update [timesheets] set [week] = datepart(week, [date])");

            migrationBuilder.AlterColumn<int>(
                name: "Week",
                table: "Timesheets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Week",
                table: "Timesheets");
        }
    }
}
