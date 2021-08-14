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

        // GET: Use3DmodelTest
        public ActionResult Index()
        {
            var assys = db.t_assemblies;
            return View(assys.ToList());
        }

        [HttpGet]
        public async Task<IActionResult> EditProductInstruction(long id_assy)
        {
            if (id_assy == null)
            {
                return NotFound();
            }



            var t = db.t_assemblies.Find(id_assy);


            return View(t);
            //return View(id_assy);

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
                    return RedirectToAction("EditProductInstruction", new { id_assy = id_assy});

                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_assy);
        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductView(
                                                        long id_assy,int id_view,
                                                        float cam_pos_x,float cam_pos_y,float cam_pos_z,
                                                        float cam_lookat_x,float cam_lookat_y,float cam_lookat_z,
                                                        float cam_quat_x,float cam_quat_y,float cam_quat_z,float cam_quat_w,
                                                        float obt_target_x,float obt_target_y,float obt_target_z
            )
        {
            if (id_assy == null | id_view == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await db.t_views.FindAsync(id_assy, id_view);
                    if (target == null)
                    {
                        return NotFound();
                    }

                    // データ更新
                    //カメラ位置
                    target.cam_pos_x = cam_pos_x;
                    target.cam_pos_y = cam_pos_y;
                    target.cam_pos_z = cam_pos_z;

                    //Lookat(現状まともに動いていない)
                    target.cam_lookat_x = cam_lookat_x;
                    target.cam_lookat_y = cam_lookat_y;
                    target.cam_lookat_z = cam_lookat_z;

                    //カメラのクオータニオン
                    target.cam_quat_x = cam_quat_x;
                    target.cam_quat_y = cam_quat_y;
                    target.cam_quat_z = cam_quat_z;
                    target.cam_quat_w = cam_quat_w;

                    //OrbitControlのターゲット
                    target.obt_target_x = obt_target_x;
                    target.obt_target_y = obt_target_y;
                    target.obt_target_z = obt_target_z;

                    // DBに更新を反映
                    await db.SaveChangesAsync();


                    TempData["ResultMsg"] = "Update Success";
                    return RedirectToAction("EditProductInstruction", new { id_assy = id_assy});

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