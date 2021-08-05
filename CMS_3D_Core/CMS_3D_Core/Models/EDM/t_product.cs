using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_product
    {
        public long id_product { get; set; }
        public long id_assy { get; set; }
        public long id_ruct { get; set; }

        public virtual t_assembly id_assyNavigation { get; set; }
    }
}
