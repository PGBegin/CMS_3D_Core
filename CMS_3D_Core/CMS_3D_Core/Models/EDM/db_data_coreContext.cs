using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class db_data_coreContext : DbContext
    {
        public db_data_coreContext()
        {
        }

        public db_data_coreContext(DbContextOptions<db_data_coreContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRole> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }
        public virtual DbSet<t_assembly> t_assemblies { get; set; }
        public virtual DbSet<t_instance_part> t_instance_parts { get; set; }
        public virtual DbSet<t_instruction> t_instructions { get; set; }
        public virtual DbSet<t_part> t_parts { get; set; }
        public virtual DbSet<t_part_display> t_part_displays { get; set; }
        public virtual DbSet<t_product> t_products { get; set; }
        public virtual DbSet<t_view> t_views { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=db_data_core");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<AspNetRole>(entity =>
            {
                entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedName] IS NOT NULL)");

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.Property(e => e.NormalizedName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetRoleClaim>(entity =>
            {
                entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

                entity.Property(e => e.RoleId).IsRequired();

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetRoleClaims)
                    .HasForeignKey(d => d.RoleId);
            });

            modelBuilder.Entity<AspNetUser>(entity =>
            {
                entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

                entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                    .IsUnique()
                    .HasFilter("([NormalizedUserName] IS NOT NULL)");

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.NormalizedEmail).HasMaxLength(256);

                entity.Property(e => e.NormalizedUserName).HasMaxLength(256);

                entity.Property(e => e.UserName).HasMaxLength(256);
            });

            modelBuilder.Entity<AspNetUserClaim>(entity =>
            {
                entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserLogin>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey });

                entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.ProviderKey).HasMaxLength(128);

                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserRole>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.HasIndex(e => e.RoleId, "IX_AspNetUserRoles_RoleId");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<AspNetUserToken>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name });

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.Name).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserTokens)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<t_assembly>(entity =>
            {
                entity.HasKey(e => e.id_assy);

                entity.ToTable("t_assembly");

                entity.HasComment("組み立てに関わる基本情報を格納する");

                entity.Property(e => e.id_assy).ValueGeneratedNever();
            });

            modelBuilder.Entity<t_instance_part>(entity =>
            {
                entity.HasKey(e => new { e.id_assy, e.id_inst })
                    .HasName("PK_t_instance_parts");

                entity.ToTable("t_instance_part");

                entity.HasOne(d => d.id_assyNavigation)
                    .WithMany(p => p.t_instance_parts)
                    .HasForeignKey(d => d.id_assy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_instance_part_t_assembly");

                entity.HasOne(d => d.id_partNavigation)
                    .WithMany(p => p.t_instance_parts)
                    .HasForeignKey(d => d.id_part)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_instance_part_t_part");
            });

            modelBuilder.Entity<t_instruction>(entity =>
            {
                entity.HasKey(e => new { e.id_assy, e.id_ruct });

                entity.ToTable("t_instruction");

                entity.Property(e => e.short_description).HasMaxLength(256);

                entity.Property(e => e.title).HasMaxLength(128);

                entity.HasOne(d => d.id_assyNavigation)
                    .WithMany(p => p.t_instructions)
                    .HasForeignKey(d => d.id_assy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_instruction_t_assembly");

                entity.HasOne(d => d.id_)
                    .WithMany(p => p.t_instructions)
                    .HasForeignKey(d => new { d.id_assy, d.id_view })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_instruction_t_view");
            });

            modelBuilder.Entity<t_part>(entity =>
            {
                entity.HasKey(e => e.id_part);

                entity.ToTable("t_part");

                entity.Property(e => e.id_part).ValueGeneratedNever();

                entity.Property(e => e.part_number)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.type_data).HasMaxLength(128);

                entity.Property(e => e.type_texture).HasMaxLength(128);
            });

            modelBuilder.Entity<t_part_display>(entity =>
            {
                entity.HasKey(e => new { e.id_ruct, e.id_assy, e.id_inst });

                entity.ToTable("t_part_display");

                entity.HasOne(d => d.id_)
                    .WithMany(p => p.t_part_displays)
                    .HasForeignKey(d => new { d.id_assy, d.id_ruct })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_part_display_t_instruction");
            });

            modelBuilder.Entity<t_product>(entity =>
            {
                entity.HasKey(e => e.id_product);

                entity.ToTable("t_product");

                entity.HasComment("総合的な製品情報を格納するテーブル");

                entity.Property(e => e.id_product).ValueGeneratedNever();

                entity.HasOne(d => d.id_assyNavigation)
                    .WithMany(p => p.t_products)
                    .HasForeignKey(d => d.id_assy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_product_t_assembly");
            });

            modelBuilder.Entity<t_view>(entity =>
            {
                entity.HasKey(e => new { e.id_assy, e.id_view });

                entity.ToTable("t_view");

                entity.HasOne(d => d.id_assyNavigation)
                    .WithMany(p => p.t_views)
                    .HasForeignKey(d => d.id_assy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_view_t_assembly");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
