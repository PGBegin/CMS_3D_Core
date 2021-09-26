using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_view
    {
        public t_view()
        {
            t_instructions = new HashSet<t_instruction>();
        }

        public long id_article { get; set; }
        public int id_view { get; set; }
        public string title { get; set; }
        public double? cam_pos_x { get; set; }
        public double? cam_pos_y { get; set; }
        public double? cam_pos_z { get; set; }
        public double? cam_lookat_x { get; set; }
        public double? cam_lookat_y { get; set; }
        public double? cam_lookat_z { get; set; }
        public double? cam_quat_x { get; set; }
        public double? cam_quat_y { get; set; }
        public double? cam_quat_z { get; set; }
        public double? cam_quat_w { get; set; }
        public double? obt_target_x { get; set; }
        public double? obt_target_y { get; set; }
        public double? obt_target_z { get; set; }
        public string create_user { get; set; }
        public DateTime? create_datetime { get; set; }
        public string latest_update_user { get; set; }
        public DateTime? latest_update_datetime { get; set; }

        public virtual t_article id_articleNavigation { get; set; }
        public virtual ICollection<t_instruction> t_instructions { get; set; }
    }
}
