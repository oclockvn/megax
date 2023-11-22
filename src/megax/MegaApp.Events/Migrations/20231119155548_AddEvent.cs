using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Events.Migrations
{
    /// <inheritdoc />
    public partial class AddEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "event");

            migrationBuilder.CreateTable(
                name: "SysEventTypes",
                schema: "event",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SysEventTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SysEvents",
                schema: "event",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventTypeId = table.Column<int>(type: "int", nullable: false),
                    Payload = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Published = table.Column<bool>(type: "bit", nullable: false, defaultValueSql: "0"),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false, defaultValueSql: "sysdatetimeoffset()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SysEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SysEvents_SysEventTypes_EventTypeId",
                        column: x => x.EventTypeId,
                        principalSchema: "event",
                        principalTable: "SysEventTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SysEvents_EventTypeId",
                schema: "event",
                table: "SysEvents",
                column: "EventTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SysEventTypes_Name",
                schema: "event",
                table: "SysEventTypes",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SysEvents",
                schema: "event");

            migrationBuilder.DropTable(
                name: "SysEventTypes",
                schema: "event");
        }
    }
}
