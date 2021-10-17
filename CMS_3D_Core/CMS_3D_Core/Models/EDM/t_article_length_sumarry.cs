using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_article_length_sumarry
    {
        public DateTime latest_update_datetime { get; set; }
        public short status { get; set; }
        public long length { get; set; }
        public long length_first { get; set; }
    }
}
