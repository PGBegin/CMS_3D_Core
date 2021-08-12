﻿using Microsoft.EntityFrameworkCore;
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
    public class ContentsEditController : Controller
    {
        private db_data_coreContext db = new db_data_coreContext();

        /*

        // GET: サンプルデータをJSONで返す(idは練習用のダミー)
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

        // 選択されたオブジェクトファイルを返す関数
        public ActionResult GetPartObjectFile(long id_part)
        {
            t_part t_part = db.t_parts.Find(id_part);



            return File(t_part.file_data, t_part.type_data, t_part.part_number);
        }

        // 選択されたオブジェクトファイルを返す関数
        public ActionResult GetPartTextureFile(long id_part)
        {
            t_part t_part = db.t_parts.Find(id_part);

            return File(t_part.file_texture, t_part.type_texture, t_part.part_number);
        }
        */

        // GET: Use3DmodelTest
        public ActionResult Index()
        {
            var assys = db.t_assemblies;
            return View(assys.ToList());
        }

        /*
        [HttpGet]
        public ActionResult DetailProductInstruction(long id_assy)
        {
            return View(id_assy);
        }
        */

        [HttpGet]
        public async Task<IActionResult> EditProductInstruction(long id_assy)
        {
            if (id_assy == null)
            {
                return NotFound();
            }

            return View(id_assy);
        }


        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductInstruction(long id_assy, long id_rust, string title, string short_description)
        {


            if (id_assy == null | id_rust == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await db.t_instructions.FindAsync(id_assy, id_rust);
                    if (target == null)
                    {
                        return NotFound();
                    }

                    // データ更新
                    target.title = title;
                    target.short_description = short_description;

                    // DBに更新を反映
                    await db.SaveChangesAsync();


                    TempData["ResultMsg"] = "Update Success";
                    return RedirectToAction("EditProductInstruction", new { id_assy = id_assy, id_rust = id_rust });

                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
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