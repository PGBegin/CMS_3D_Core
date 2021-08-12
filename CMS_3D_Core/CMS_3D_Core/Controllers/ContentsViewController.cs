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
        /*
        /// <summary>
        /// GET: コンテンツのベースデータをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public JsonResult GetAssemblyObjectList(int id_assy)
        {
            var t = db.t_assemblies
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.t_instance_parts)
                        .FirstOrDefault(x => x.id_assy == id_assy);

            IList<object> objCollection = new List<object>();

            foreach (var item in t.t_instance_parts)
            {
                objCollection.Add(new { type = "instance_part", id_assy = item.id_assy, id_inst = item.id_inst, id_part = item.id_part });
            }

            foreach (var item in t.t_instructions)
            {
                objCollection.Add(new { type = "instruction", id_assy = item.id_assy, id_ruct = item.id_ruct, id_view = item.id_view, title = item.title, short_description = item.short_description });
            }

            foreach (var item in t.t_views)
            {
                objCollection.Add(new { type = "view", id_assy = item.id_assy, id_view = item.id_view, cx = item.cx, cy = item.cy, cz = item.cz, tx = item.tx, ty = item.ty, tz = item.tz });
            }

            return Json(objCollection);
        }

        /// <summary>
        /// GET: 選択されたオブジェクトファイルを返す関数
        /// </summary>
        /// <param name="id_part"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetPartObjectFile(long id_part)
        {
            t_part t_part = db.t_parts.Find(id_part);

            return File(t_part.file_data, t_part.type_data, t_part.part_number);
        }
        */

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
            return View(id_assy);
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
