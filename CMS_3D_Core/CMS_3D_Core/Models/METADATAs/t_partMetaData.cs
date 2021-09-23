using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;



namespace CMS_3D_Core.Models.EDM
{
    public class t_partMetaData
    {
        //[Key]
        [Required]
        public long id_part { get; set; }

        [Display(Name = "Part Number")]
        public string part_number { get; set; }

        [Display(Name = "Version")]
        public int version { get; set; }
        public byte[] file_data { get; set; }
        public string type_data { get; set; }
        public string format_data { get; set; }
        public byte[] file_texture { get; set; }
        public string type_texture { get; set; }
        public string file_name { get; set; }
        public long? file_length { get; set; }
        public string itemlink { get; set; }
        public string license { get; set; }
        public string memo { get; set; }
        public string create_user { get; set; }
        public DateTime? create_datetime { get; set; }
        public string latest_update_user { get; set; }
        public DateTime? latest_update_datetime { get; set; }
    }


    [ModelMetadataType(typeof(t_partMetaData))]
    public partial class t_part
    {

    }
}
