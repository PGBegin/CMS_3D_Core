using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_part_display
    {
        public long id_ruct { get; set; }
        public long id_assy { get; set; }
        public long id_inst { get; set; }
        public long id_part { get; set; }

        public virtual t_instruction id_ { get; set; }
    }
}
