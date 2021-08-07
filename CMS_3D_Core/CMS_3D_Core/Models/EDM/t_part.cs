using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_part
    {
        public t_part()
        {
            t_instance_parts = new HashSet<t_instance_part>();
        }

        public long id_part { get; set; }
        public string part_number { get; set; }
        public int version { get; set; }
        public byte[] file_data { get; set; }
        public string type_data { get; set; }
        public byte[] file_texture { get; set; }
        public string type_texture { get; set; }

        public virtual ICollection<t_instance_part> t_instance_parts { get; set; }
    }
}
