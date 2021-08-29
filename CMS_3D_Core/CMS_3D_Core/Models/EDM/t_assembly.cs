using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_assembly
    {
        public t_assembly()
        {
            t_articles = new HashSet<t_article>();
            t_instance_parts = new HashSet<t_instance_part>();
        }

        public long id_assy { get; set; }
        public string assy_name { get; set; }

        public virtual ICollection<t_article> t_articles { get; set; }
        public virtual ICollection<t_instance_part> t_instance_parts { get; set; }
    }
}
