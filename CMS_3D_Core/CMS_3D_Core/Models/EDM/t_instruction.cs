using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_instruction
    {
        public t_instruction()
        {
            t_part_displays = new HashSet<t_part_display>();
        }

        public long id_assy { get; set; }
        public long id_ruct { get; set; }
        public int id_view { get; set; }
        public string title { get; set; }
        public string short_description { get; set; }

        public virtual t_view id_ { get; set; }
        public virtual t_assembly id_assyNavigation { get; set; }
        public virtual ICollection<t_part_display> t_part_displays { get; set; }
    }
}
