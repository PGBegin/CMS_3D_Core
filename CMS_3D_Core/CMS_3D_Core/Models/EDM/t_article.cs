using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_article
    {
        public t_article()
        {
            t_instructions = new HashSet<t_instruction>();
            t_views = new HashSet<t_view>();
        }

        public long id_article { get; set; }
        public long? id_assy { get; set; }
        public string title { get; set; }
        public string short_description { get; set; }
        public string long_description { get; set; }
        public short status { get; set; }
        public int? directional_light_color { get; set; }
        public double? directional_light_intensity { get; set; }
        public double? directional_light_px { get; set; }
        public double? directional_light_py { get; set; }
        public double? directional_light_pz { get; set; }
        public int? ambient_light_color { get; set; }
        public double? ambient_light_intensity { get; set; }
        public bool? gammaOutput { get; set; }

        public virtual t_assembly id_assyNavigation { get; set; }
        public virtual m_status_article statusNavigation { get; set; }
        public virtual ICollection<t_instruction> t_instructions { get; set; }
        public virtual ICollection<t_view> t_views { get; set; }
    }
}
