using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserDeviceHistories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserDeviceHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserDeviceId = table.Column<int>(type: "int", nullable: false),
                    AssignAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDeviceHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserDeviceHistories_UserDevices_UserDeviceId",
                        column: x => x.UserDeviceId,
                        principalTable: "UserDevices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserDeviceHistories_UserDeviceId",
                table: "UserDeviceHistories",
                column: "UserDeviceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserDeviceHistories");
        }
    }
}
