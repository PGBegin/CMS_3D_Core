using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using CMS_3D_Core.Models.EDM;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;



namespace CMS_3D_Core.Controllers
{



    [Authorize]
    public class ContentsIndexingApisController : ControllerBase
    {

        private readonly db_data_coreContext _context;

        public ContentsIndexingApisController(db_data_coreContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Return a list of articles in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<IList<object>> GetArticleIndex()
        {
            var t = await _context.t_articles
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts)
                        .Include(x => x.statusNavigation)
                        .ToListAsync();



            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
                objCollection.Add(object_from_t_article(item));
            }



            return objCollection;
        }


        /// <summary>
        /// Return a list of articles in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<IList<object>> GetAssyIndex()
        {

            var t = await _context.t_assemblies
                                .Include(x => x.t_articles)
                                .ToListAsync();

            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
                objCollection.Add(object_from_t_assembly(item));
            }



            return objCollection;
        }


        /// <summary>
        /// return object with t_article
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_article(t_article item) =>
            new
            {
                type = "article",
                id_article = item.id_article,
                id_assy = item.id_assy,
                id_assy_name = item.id_assyNavigation.assy_name,
                title = item.title,
                status = item.status,
                id_attachment_for_eye_catch = item.id_attachment_for_eye_catch,
                instructions_description_Length = item.t_instructions.OrderBy(m => m.display_order).Sum(m => m.short_description.Length),
                instructions_description_Length_first = (item.t_instructions.OrderBy(m => m.display_order).FirstOrDefault() ?? new CMS_3D_Core.Models.EDM.t_instruction { short_description = "" }).short_description.Length,
                status_name = item.statusNavigation.name,
            };

        /// <summary>
        /// return object with t_article
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_assembly(t_assembly item) =>
            new
            {
                type = "assembly",
                id_assy = item.id_assy,
                assy_name = item.assy_name,
                t_articles_ref_Count = item.t_articles.Count,
            };

    }
}