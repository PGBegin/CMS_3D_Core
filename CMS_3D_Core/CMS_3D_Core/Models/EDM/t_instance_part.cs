using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_instance_part
    {
        public long id_assy { get; set; }
        public long id_inst { get; set; }
        public long id_part { get; set; }
        public string create_user { get; set; }
        public DateTime? create_datetime { get; set; }
        public string latest_update_user { get; set; }
        public DateTime? latest_update_datetime { get; set; }
        public double pos_x { get; set; }
        public double pos_y { get; set; }
        public double pos_z { get; set; }

        public virtual t_assembly id_assyNavigation { get; set; }
        public virtual t_part id_partNavigation { get; set; }
    }
}
