using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/*
namespace CMS_3D_Core.Controllers
{
    public class Use3DmodelTestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}*/


using System;
using System.Collections.Generic;
using System.Data;
//using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
//using System.Web.Mvc;
using CMS_3D_Core.Models.EDM;

namespace CMS_3D_Core.Controllers
{
    public class Use3DmodelTestController : Controller
    {
        private db_data_coreContext db = new db_data_coreContext();


        // GET: サンプルデータをJSONで返す(idは練習用のダミー)
        [HttpGet]
//        public ActionResult get_sample_list(int? dummyid = null)
        public JsonResult get_sample_list(int? dummyid = null)
        {
            IList<object> objCollection = new List<object>(){
                new { type = "view", id_assy = 1, id_view = 1, cx = 100, cy = 100, cz = 100, tx= 0, ty=0, tz = 0 },
                new { type = "view", id_assy = 1, id_view = 2, cx = 30, cy = 30, cz = 30, tx= 0, ty=0, tz = 0 },
                new { type = "view", id_assy = 1, id_view = 3, cx = 100, cy = -200, cz = 100, tx= 0, ty=0, tz = 0 },
                new { type = "instruction", id_assy = 1, id_ruct = 1, id_view = 1, title = "inst01", short_description = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
                new { type = "instruction", id_assy = 1, id_ruct = 2, id_view = 2, title = "inst02" , short_description = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY" },
                new { type = "instruction", id_assy = 1, id_ruct = 3, id_view = 3, title = "inst03" , short_description = "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ" },
                new { type = "instance_part", id_assy = 1, id_inst = 1, id_part = 1 }
            };
            //objCollection.Add(new { name = "append_data", score = 98 });

            return Json(objCollection);
        }



        // 選択されたオブジェクトファイルを返す関数
        public ActionResult GetPartObjectFile(long id_part)
        {
            t_part t_part = db.t_parts.Find(id_part);

            return File(t_part.file_data, "application/object", t_part.part_number);
        }

        // 選択されたオブジェクトファイルを返す関数
        public ActionResult GetPartTextureFile(long id_part)
        {
            t_part t_part = db.t_parts.Find(id_part);

            return File(t_part.file_texture, "application/object", t_part.part_number);
        }


        // GET: Use3DmodelTest
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult show_test()
        {
            return View();
        }
        public ActionResult show_test2()
        {
            return View();
        }
        public ActionResult show_test3()
        {
            return View();
        }


        public ActionResult show_test4()
        {
            return View();
        }
        public ActionResult show_test5()
        {
            return View();
        }
        public ActionResult show_test6()
        {
            return View();
        }
        public ActionResult show_test7()
        {
            return View();
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
