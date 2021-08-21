using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMS_3D_Core.Models.EDM;





namespace CMS_3D_Core.Controllers
{
    [Authorize]
    public class ContentsEditController : Controller
    {
        private db_data_coreContext db = new db_data_coreContext();

        // GET: Use3DmodelTest
//        public ActionResult Index()
        public async Task<IActionResult> Index()
        {
            var assys = await db.t_assemblies.ToListAsync();
            return View(assys);
        }

        [HttpGet]
        public async Task<IActionResult> EditProductInstruction(long id_assy)
        {
            if (id_assy == null)
            {
                return NotFound();
            }



            var t = await db.t_assemblies.FindAsync(id_assy);


            return View(t);
            //return View(id_assy);

        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductInstruction(long id_assy, long id_rust, int id_view, string title, string short_description, long display_order)
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
                        t_instruction t_instruction = new t_instruction();
                        t_instruction.id_assy = id_assy;
                        t_instruction.id_ruct = id_rust;
                        t_instruction.id_view = id_view;
                        t_instruction.title = title;
                        t_instruction.short_description = short_description;
                        t_instruction.display_order = display_order;

                        await db.AddAsync(t_instruction);
                        await db.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditProductInstruction", new { id_assy = id_assy });
                    } else
                    {
                        // データ更新
                        target.id_view = id_view;
                        target.title = title;
                        target.short_description = short_description;
                        target.display_order = display_order;

                        // DBに更新を反映
                        await db.SaveChangesAsync();


                        TempData["ResultMsg"] = "Update Success";
                        return RedirectToAction("EditProductInstruction", new { id_assy = id_assy });
                    }


                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_assy);
        }


        // POST: t_instance_part/Delete/5
        [HttpPost, ActionName("DeleteProductInstruction")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProductInstructionConfirmed(long id_assy, long id_rust)
        {
            t_instruction t_instruction = await db.t_instructions.FindAsync(id_assy, id_rust);
            db.t_instructions.Remove(t_instruction);
            await db.SaveChangesAsync();

            TempData["ResultMsg"] = "Update Success";
            return RedirectToAction("EditProductInstruction", new { id_assy = id_assy });
        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductView(
                                                        long id_assy, int id_view, string title,
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

                        t_view t_view = new t_view();
                        // データ更新
                        t_view.title = title;
                        //カメラ位置
                        t_view.cam_pos_x = cam_pos_x;
                        t_view.cam_pos_y = cam_pos_y;
                        t_view.cam_pos_z = cam_pos_z;

                        //Lookat(現状まともに動いていない)
                        t_view.cam_lookat_x = cam_lookat_x;
                        t_view.cam_lookat_y = cam_lookat_y;
                        t_view.cam_lookat_z = cam_lookat_z;

                        //カメラのクオータニオン
                        t_view.cam_quat_x = cam_quat_x;
                        t_view.cam_quat_y = cam_quat_y;
                        t_view.cam_quat_z = cam_quat_z;
                        t_view.cam_quat_w = cam_quat_w;

                        //OrbitControlのターゲット
                        t_view.obt_target_x = obt_target_x;
                        t_view.obt_target_y = obt_target_y;
                        t_view.obt_target_z = obt_target_z;

                        // DBに更新を反映

                        await db.AddAsync(t_view);
                        await db.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditProductInstruction", new { id_assy = id_assy });
                    }

                    // データ更新
                    target.title = title;
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

        //-------------------------------------------------------------------
        //アイテム追加
        // GET: t_assembly/Create
        public async Task<IActionResult> CreateAssembly()
        {
            return View();
        }

        // POST: t_assembly/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAssembly([Bind("id_assy,assy_name")] t_assembly t_assembly)
        {
            if (ModelState.IsValid)
            {
                await db.AddAsync(t_assembly);
                await db.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(t_assembly);
        }

        public ActionResult CreateInstancePart(long? id_assy)
        {
            t_instance_part t_instance_part = new t_instance_part();
            t_instance_part.id_assy = id_assy.Value;

            ViewData["id_assy"] = new SelectList(db.t_assemblies, "id_assy", "assy_name");
            ViewData["id_part"] = new SelectList(db.t_parts, "id_part", "part_number");
            return View(t_instance_part);
        }

        // POST: t_assembly/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateInstancePart([Bind("id_assy,id_inst,id_part")] t_instance_part t_instance_part)
        {
            if (ModelState.IsValid)
            {
                await db.AddAsync(t_instance_part);
                await db.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(t_instance_part);
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