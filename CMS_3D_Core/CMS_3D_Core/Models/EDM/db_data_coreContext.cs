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
        public virtual DbSet<m_status_article> m_status_articles { get; set; }
        public virtual DbSet<t_article> t_articles { get; set; }
        public virtual DbSet<t_assembly> t_assemblies { get; set; }
        public virtual DbSet<t_instance_part> t_instance_parts { get; set; }
        public virtual DbSet<t_instruction> t_instructions { get; set; }
        public virtual DbSet<t_part> t_parts { get; set; }
        public virtual DbSet<t_part_display> t_part_displays { get; set; }
        public virtual DbSet<t_view> t_views { get; set; }
        public virtual DbSet<t_website_setting> t_website_settings { get; set; }

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

            modelBuilder.Entity<m_status_article>(entity =>
            {
                entity.ToTable("m_status_article");

                entity.Property(e => e.id).ValueGeneratedNever();

                entity.Property(e => e.description).HasMaxLength(250);

                entity.Property(e => e.name).HasMaxLength(50);
            });

            modelBuilder.Entity<t_article>(entity =>
            {
                entity.HasKey(e => e.id_article)
                    .HasName("PK_t_product");

                entity.ToTable("t_article");

                entity.HasComment("総合的な製品情報を格納するテーブル");

                entity.Property(e => e.id_article).ValueGeneratedNever();

                entity.Property(e => e.meta_description).HasMaxLength(550);

                entity.Property(e => e.short_description).HasMaxLength(550);

                entity.Property(e => e.title).HasMaxLength(250);

                entity.HasOne(d => d.id_assyNavigation)
                    .WithMany(p => p.t_articles)
                    .HasForeignKey(d => d.id_assy)
                    .HasConstraintName("FK_t_product_t_assembly");

                entity.HasOne(d => d.statusNavigation)
                    .WithMany(p => p.t_articles)
                    .HasForeignKey(d => d.status)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_article_m_status_article");
            });

            modelBuilder.Entity<t_assembly>(entity =>
            {
                entity.HasKey(e => e.id_assy);

                entity.ToTable("t_assembly");

                entity.HasComment("組み立てに関わる基本情報を格納する");

                entity.Property(e => e.id_assy).ValueGeneratedNever();

                entity.Property(e => e.assy_name).HasMaxLength(250);
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
                entity.HasKey(e => new { e.id_article, e.id_instruct });

                entity.ToTable("t_instruction");

                entity.Property(e => e.title).HasMaxLength(128);

                entity.HasOne(d => d.id_articleNavigation)
                    .WithMany(p => p.t_instructions)
                    .HasForeignKey(d => d.id_article)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_instruction_t_article");

                entity.HasOne(d => d.id_)
                    .WithMany(p => p.t_instructions)
                    .HasForeignKey(d => new { d.id_article, d.id_view })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_instruction_t_view");
            });

            modelBuilder.Entity<t_part>(entity =>
            {
                entity.HasKey(e => e.id_part);

                entity.ToTable("t_part");

                entity.Property(e => e.id_part).ValueGeneratedNever();

                entity.Property(e => e.file_name).HasMaxLength(255);

                entity.Property(e => e.format_data).HasMaxLength(50);

                entity.Property(e => e.itemlink).HasMaxLength(2048);

                entity.Property(e => e.license).HasMaxLength(255);

                entity.Property(e => e.memo).HasMaxLength(2048);

                entity.Property(e => e.part_number)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.type_data).HasMaxLength(128);

                entity.Property(e => e.type_texture).HasMaxLength(128);
            });

            modelBuilder.Entity<t_part_display>(entity =>
            {
                entity.HasKey(e => new { e.id_instruct, e.id_assy, e.id_inst });

                entity.ToTable("t_part_display");
            });

            modelBuilder.Entity<t_view>(entity =>
            {
                entity.HasKey(e => new { e.id_article, e.id_view });

                entity.ToTable("t_view");

                entity.Property(e => e.title).HasMaxLength(128);

                entity.HasOne(d => d.id_articleNavigation)
                    .WithMany(p => p.t_views)
                    .HasForeignKey(d => d.id_article)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_t_view_t_article");
            });

            modelBuilder.Entity<t_website_setting>(entity =>
            {
                entity.HasKey(e => e.title);

                entity.ToTable("t_website_setting");

                entity.Property(e => e.title).HasMaxLength(50);

                entity.Property(e => e.data).HasMaxLength(2000);

                entity.Property(e => e.memo).HasMaxLength(255);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
