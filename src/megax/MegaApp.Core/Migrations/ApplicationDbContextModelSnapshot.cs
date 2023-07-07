﻿// <auto-generated />
using System;
using MegaApp.Core.Db;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MegaApp.Core.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Account", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("OAuthType")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<int>("Provider")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Accounts", "auth");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Device", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("DeviceTypeId")
                        .HasColumnType("int");

                    b.Property<bool>("Disabled")
                        .HasColumnType("bit");

                    b.Property<string>("Model")
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.Property<string>("Name")
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.Property<string>("Notes")
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTimeOffset>("PurchasedAt")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("SerialNumber")
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.Property<int?>("SupplierId")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset?>("WarrantyToDate")
                        .HasColumnType("datetimeoffset");

                    b.HasKey("Id");

                    b.HasIndex("DeviceTypeId");

                    b.HasIndex("SerialNumber")
                        .IsUnique()
                        .HasFilter("[SerialNumber] IS NOT NULL");

                    b.HasIndex("SupplierId");

                    b.ToTable("Devices");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.DeviceHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTimeOffset>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetimeoffset")
                        .HasDefaultValueSql("SYSDATETIMEOFFSET()");

                    b.Property<int?>("CreatedBy")
                        .HasColumnType("int");

                    b.Property<int>("DeviceId")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<DateTimeOffset?>("ReturnedAt")
                        .HasColumnType("datetimeoffset");

                    b.Property<DateTimeOffset>("TakenAt")
                        .HasColumnType("datetimeoffset");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DeviceId");

                    b.HasIndex("UserId");

                    b.ToTable("DeviceHistories");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.DeviceType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique()
                        .HasFilter("[Name] IS NOT NULL");

                    b.ToTable("DeviceTypes");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Monitor"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Mouse"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Keyboard"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Headset"
                        },
                        new
                        {
                            Id = 5,
                            Name = "Graphic Card"
                        },
                        new
                        {
                            Id = 6,
                            Name = "CPU"
                        },
                        new
                        {
                            Id = 7,
                            Name = "RAM"
                        },
                        new
                        {
                            Id = 8,
                            Name = "Wifi Router"
                        },
                        new
                        {
                            Id = 9,
                            Name = "Camera"
                        },
                        new
                        {
                            Id = 10,
                            Name = "Laptop"
                        });
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.RefreshToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("AccountId")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetimeoffset")
                        .HasDefaultValueSql("sysdatetimeoffset()");

                    b.Property<DateTimeOffset>("ExpiresAt")
                        .HasColumnType("datetimeoffset");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<string>("Token")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AccountId");

                    b.ToTable("RefreshTokens", "auth");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Supplier", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Website")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Supplier");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetimeoffset")
                        .HasDefaultValueSql("sysdatetimeoffset()");

                    b.Property<int?>("CreatedBy")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset?>("Dob")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FullName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("IdentityNumber")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Phone")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique()
                        .HasFilter("[Email] IS NOT NULL");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Account", b =>
                {
                    b.HasOne("MegaApp.Core.Db.Entities.User", "User")
                        .WithMany("Accounts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Device", b =>
                {
                    b.HasOne("MegaApp.Core.Db.Entities.DeviceType", "DeviceType")
                        .WithMany("Devices")
                        .HasForeignKey("DeviceTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MegaApp.Core.Db.Entities.Supplier", "Supplier")
                        .WithMany()
                        .HasForeignKey("SupplierId");

                    b.Navigation("DeviceType");

                    b.Navigation("Supplier");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.DeviceHistory", b =>
                {
                    b.HasOne("MegaApp.Core.Db.Entities.Device", "Device")
                        .WithMany("Histories")
                        .HasForeignKey("DeviceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MegaApp.Core.Db.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Device");

                    b.Navigation("User");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.RefreshToken", b =>
                {
                    b.HasOne("MegaApp.Core.Db.Entities.Account", "Account")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("AccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Account", b =>
                {
                    b.Navigation("RefreshTokens");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.Device", b =>
                {
                    b.Navigation("Histories");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.DeviceType", b =>
                {
                    b.Navigation("Devices");
                });

            modelBuilder.Entity("MegaApp.Core.Db.Entities.User", b =>
                {
                    b.Navigation("Accounts");
                });
#pragma warning restore 612, 618
        }
    }
}
