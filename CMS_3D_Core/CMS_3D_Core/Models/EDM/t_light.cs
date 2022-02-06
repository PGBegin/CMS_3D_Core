using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_light
    {
        public long id_article { get; set; }
        public long id_light { get; set; }
        public string light_type { get; set; }
        public string title { get; set; }
        public string short_description { get; set; }
        public int? color { get; set; }
        public double? intensity { get; set; }
        public double? px { get; set; }
        public double? py { get; set; }
        public double? pz { get; set; }
        public double? distance { get; set; }
        public double? decay { get; set; }
        public double? power { get; set; }
        public double? shadow { get; set; }
        public double? tx { get; set; }
        public double? ty { get; set; }
        public double? tz { get; set; }
        public int? skycolor { get; set; }
        public int? groundcolor { get; set; }
        public bool is_lensflare { get; set; }
        public double? lfsize { get; set; }
        public byte[] file_data { get; set; }
        public string create_user { get; set; }
        public DateTime? create_datetime { get; set; }
        public string latest_update_user { get; set; }
        public DateTime? latest_update_datetime { get; set; }

        public virtual t_article id_articleNavigation { get; set; }
    }
}
