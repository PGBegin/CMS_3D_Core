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
        //private db_data_coreContext db = new db_data_coreContext();
        private readonly db_data_coreContext _context;

        public ContentsEditController(db_data_coreContext context)
        {
            _context = context;
        }

        // GET: Use3DmodelTest
        //        public ActionResult Index()
        public async Task<IActionResult> Index()
        {
            var assys = await _context.t_articles
                                        .Include(t => t.id_assyNavigation)
                                        .ToListAsync();
            return View(assys);
        }

        [HttpGet]
        public async Task<IActionResult> EditProductInstruction(long id_article)
        {
            if (id_article == null)
            {
                return NotFound();
            }



            var t = await _context.t_articles.FindAsync(id_article);


            return View(t);
            //return View(id_assy);

        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductInstruction(long id_article, long id_instruct, int id_view, string title, string short_description, long display_order)
        {
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_instructions.FindAsync(id_article, id_instruct);
                    if (target == null)
                    {
                        t_instruction t_instruction = new t_instruction();
                        t_instruction.id_article = id_article;
                        t_instruction.id_instruct = id_instruct;
                        t_instruction.id_view = id_view;
                        t_instruction.title = title;
                        t_instruction.short_description = short_description;
                        t_instruction.display_order = display_order;

                        await _context.AddAsync(t_instruction);
                        await _context.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditProductInstruction", new { id_article = id_article });
                    } else
                    {
                        // データ更新
                        target.id_view = id_view;
                        target.title = title;
                        target.short_description = short_description;
                        target.display_order = display_order;

                        // DBに更新を反映
                        await _context.SaveChangesAsync();


                        TempData["ResultMsg"] = "Update Success";
                        return RedirectToAction("EditProductInstruction", new { id_article = id_article });
                    }


                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_article);
        }


        // POST: t_instance_part/Delete/5
        [HttpPost, ActionName("DeleteProductInstruction")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProductInstructionConfirmed(long id_article, long id_instruct)
        {
            t_instruction t_instruction = await _context.t_instructions.FindAsync(id_article, id_instruct);
            _context.t_instructions.Remove(t_instruction);
            await _context.SaveChangesAsync();

            TempData["ResultMsg"] = "Update Success";
            return RedirectToAction("EditProductInstruction", new { id_article = id_article });
        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductView(
                                                        long id_article, int id_view, string title,
                                                        float cam_pos_x,float cam_pos_y,float cam_pos_z,
                                                        float cam_lookat_x,float cam_lookat_y,float cam_lookat_z,
                                                        float cam_quat_x,float cam_quat_y,float cam_quat_z,float cam_quat_w,
                                                        float obt_target_x,float obt_target_y,float obt_target_z
            )
        {
            if (id_article == null | id_view == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_views.FindAsync(id_article, id_view);
                    if (target == null)
                    {

                        t_view t_view = new t_view();
                        // データ更新
                        t_view.id_article = id_article;
                        t_view.id_view = id_view;
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

                        await _context.AddAsync(t_view);
                        await _context.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditProductInstruction", new { id_article = id_article });
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
                    await _context.SaveChangesAsync();


                    TempData["ResultMsg"] = "Update Success";
                    return RedirectToAction("EditProductInstruction", new { id_article = id_article });

                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_article);
        }
        /*
        // POST: t_instance_part/Delete/5
        [HttpPost, ActionName("DeleteProductView")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProductViewConfirmed(long id_assy, long id_view)
        {
            t_view t_view = await _context.t_views.FindAsync(id_assy, id_view);
            _context.t_views.Remove(t_view);
            await _context.SaveChangesAsync();

            TempData["ResultMsg"] = "Update Success";
            return RedirectToAction("EditProductInstruction", new { id_assy = id_assy });
        }
        */
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
                await _context.AddAsync(t_assembly);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(t_assembly);
        }

        public ActionResult CreateInstancePart(long? id_assy)
        {
            t_instance_part t_instance_part = new t_instance_part();
            t_instance_part.id_assy = id_assy.Value;

            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name");
            ViewData["id_part"] = new SelectList(_context.t_parts, "id_part", "part_number");




            //List<SelectListItem> x =  new SelectList(_context.t_parts, "id_part", "part_number");


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
                await _context.AddAsync(t_instance_part);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(t_instance_part);
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