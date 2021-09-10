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


namespace CMS_3D_Core.Controllers
{
    public class ContentsViewController : Controller
    {
        //private db_data_coreContext db = new db_data_coreContext();

        private readonly db_data_coreContext _context;

        public ContentsViewController(db_data_coreContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: コンテンツの一覧TOP画面
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            //var assys = _context.t_assemblies;
            //return View(assys.ToList());
            return View();
        }


        /// <summary>
        /// GET: コンテンツを表示する
        /// </summary>
        /// <param name="id_assy"></param>
        /// <returns></returns>
        [HttpGet]
        //public ActionResult DetailProductInstruction(long? id_article)
        public async Task<IActionResult> DetailProductInstruction(long? id_article)
        {

            if (id_article == null)
            {
                return NotFound();
            }

            /*
            var min_display = await _context.t_instructions
                                        .Where(m => id_article == id_article)
                                        .MinAsync(m => m.display_order);

            var temp = await _context.t_instructions
                                        //.OrderBy(t => t.display_order)
                                        .FirstOrDefaultAsync(m => id_article == id_article & m.display_order == min_display);

            int id_view = temp.id_view;
            */

            t_article t_article = await _context.t_articles
                                          .Include(t => t.t_views)//.Where(m => m.id_view == id_view))
                                          .Include(t => t.t_instructions)
                                          .Where(m => m.id_article == id_article & m.statusNavigation.is_approved == true)
                                          .FirstOrDefaultAsync();

            if (t_article == null)
            {
                return NotFound();
            }


            return View(t_article);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
