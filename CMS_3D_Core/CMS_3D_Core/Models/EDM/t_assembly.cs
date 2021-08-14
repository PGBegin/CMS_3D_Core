using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_assembly
    {
        public t_assembly()
        {
            t_instance_parts = new HashSet<t_instance_part>();
            t_instructions = new HashSet<t_instruction>();
            t_products = new HashSet<t_product>();
            t_views = new HashSet<t_view>();
        }

        public long id_assy { get; set; }
        public string assy_name { get; set; }

        public virtual ICollection<t_instance_part> t_instance_parts { get; set; }
        public virtual ICollection<t_instruction> t_instructions { get; set; }
        public virtual ICollection<t_product> t_products { get; set; }
        public virtual ICollection<t_view> t_views { get; set; }
    }
}
