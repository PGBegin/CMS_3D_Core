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

        public long id_assy { get; set; }
        public int id_view { get; set; }
        public double? cx { get; set; }
        public double? cy { get; set; }
        public double? cz { get; set; }
        public double? tx { get; set; }
        public double? ty { get; set; }
        public double? tz { get; set; }

        public virtual t_assembly id_assyNavigation { get; set; }
        public virtual ICollection<t_instruction> t_instructions { get; set; }
    }
}
