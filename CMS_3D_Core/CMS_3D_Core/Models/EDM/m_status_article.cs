using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class m_status_article
    {
        public m_status_article()
        {
            t_articles = new HashSet<t_article>();
        }

        public short id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public bool is_approved { get; set; }

        public virtual ICollection<t_article> t_articles { get; set; }
    }
}
