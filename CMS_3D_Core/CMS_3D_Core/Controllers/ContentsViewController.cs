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
        private db_data_coreContext db = new db_data_coreContext();

        /// <summary>
        /// GET: コンテンツの一覧TOP画面
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Index()
        {
            var assys = db.t_assemblies;
            return View(assys.ToList());
        }


        /// <summary>
        /// GET: コンテンツを表示する
        /// </summary>
        /// <param name="id_assy"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult DetailProductInstruction(long id_assy)
        {
            var t = db.t_assemblies.Find(id_assy);


            return View(t);
            //return View(id_assy);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
