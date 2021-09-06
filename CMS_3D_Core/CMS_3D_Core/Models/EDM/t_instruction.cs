using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_instruction
    {
        public long id_article { get; set; }
        public long id_instruct { get; set; }
        public int id_view { get; set; }
        public string title { get; set; }
        public string short_description { get; set; }
        public string memo { get; set; }
        public long display_order { get; set; }

        public virtual t_view id_ { get; set; }
        public virtual t_article id_articleNavigation { get; set; }
    }
}
