using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MegaApp.Core.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserDeviceSingleRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserDeviceHistories");

            migrationBuilder.DropTable(
                name: "UserDevices");

            migrationBuilder.DropIndex(
                name: "IX_Devices_DeviceCode",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Qty",
                table: "Devices");

            migrationBuilder.RenameColumn(
                name: "DeviceCode",
                table: "Devices",
                newName: "SerialNumber");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Devices",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Devices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "PurchasedAt",
                table: "Devices",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<int>(
                name: "SupplierId",
                table: "Devices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "WarrantyToDate",
                table: "Devices",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DeviceHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeviceId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TakenAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ReturnedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false, defaultValueSql: "SYSDATETIMEOFFSET()"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceHistories_Devices_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeviceHistories_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplier",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Devices_SerialNumber",
                table: "Devices",
                column: "SerialNumber",
                unique: true,
                filter: "[SerialNumber] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_SupplierId",
                table: "Devices",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceHistories_DeviceId",
                table: "DeviceHistories",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceHistories_UserId",
                table: "DeviceHistories",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_Supplier_SupplierId",
                table: "Devices",
                column: "SupplierId",
                principalTable: "Supplier",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devices_Supplier_SupplierId",
                table: "Devices");

            migrationBuilder.DropTable(
                name: "DeviceHistories");

            migrationBuilder.DropTable(
                name: "Supplier");

            migrationBuilder.DropIndex(
                name: "IX_Devices_SerialNumber",
                table: "Devices");

            migrationBuilder.DropIndex(
                name: "IX_Devices_SupplierId",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "PurchasedAt",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "SupplierId",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "WarrantyToDate",
                table: "Devices");

            migrationBuilder.RenameColumn(
                name: "SerialNumber",
                table: "Devices",
                newName: "DeviceCode");

            migrationBuilder.AddColumn<int>(
                name: "Qty",
                table: "Devices",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserDevices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeviceId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Qty = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDevices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserDevices_Devices_DeviceId",
                        column: x => x.DeviceId,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserDevices_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserDeviceHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserDeviceId = table.Column<int>(type: "int", nullable: false),
                    AssignAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    Qty = table.Column<int>(type: "int", nullable: false)
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
                name: "IX_Devices_DeviceCode",
                table: "Devices",
                column: "DeviceCode",
                unique: true,
                filter: "[DeviceCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_UserDeviceHistories_UserDeviceId",
                table: "UserDeviceHistories",
                column: "UserDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDevices_DeviceId",
                table: "UserDevices",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDevices_UserId_DeviceId",
                table: "UserDevices",
                columns: new[] { "UserId", "DeviceId" },
                unique: true);
        }
    }
}
