using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_annotation
    {
        public long id_article { get; set; }
        public long id_annotation { get; set; }
        public string title { get; set; }
        public string description1 { get; set; }
        public string description2 { get; set; }
        public short status { get; set; }
        public double? pos_x { get; set; }
        public double? pos_y { get; set; }
        public double? pos_z { get; set; }
        public string create_user { get; set; }
        public DateTime? create_datetime { get; set; }
        public string latest_update_user { get; set; }
        public DateTime? latest_update_datetime { get; set; }

        public virtual t_article id_articleNavigation { get; set; }
    }
}
