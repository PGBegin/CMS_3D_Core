using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS_3D_Core.Models
{
    // 認証機能の、ロールのCRUD用のビューモデル
    public class RoleViewModel
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "{0}は必須です。")]
        [StringLength(
          100,
          ErrorMessage = "{0} は {2} 文字以上",
          MinimumLength = 3)]
        [Display(Name = "ロール名")]
        public string Name { get; set; }
    }
}
