using System;
using System.Collections.Generic;

#nullable disable

namespace CMS_3D_Core.Models.EDM
{
    public partial class t_attachment
    {
        public long id_file { get; set; }
        public string name { get; set; }
        public byte[] file_data { get; set; }
        public string type_data { get; set; }
        public string format_data { get; set; }
        public string file_name { get; set; }
        public long? file_length { get; set; }
        public string itemlink { get; set; }
        public string license { get; set; }
        public string memo { get; set; }
        public bool? isActive { get; set; }
        public string create_user { get; set; }
        public DateTime create_datetime { get; set; }
        public string latest_update_user { get; set; }
        public DateTime latest_update_datetime { get; set; }
        public string target_article_id { get; set; }
    }
}
