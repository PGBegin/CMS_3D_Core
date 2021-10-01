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


using System.IO;



namespace CMS_3D_Core.Controllers
{
    [Authorize]
    public class ContentsEditController : Controller
    {
        private readonly db_data_coreContext _context;

        public ContentsEditController(db_data_coreContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Show Index of Edit Items Of Articles
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> Index()
        {
            var assys = await _context.t_articles
                                        .Include(t => t.id_assyNavigation)
                                        .Include(t => t.t_instructions)
                                        .Include(t => t.statusNavigation)
                                        .ToListAsync();
            return View(assys);
        }

        /// <summary>
        /// Show Edit View of Articles
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> EditProductInstruction(long? id_article)
        {
            if (id_article == null)
            {
                return NotFound();
            }

            t_article t_article = await _context.t_articles
                                          .Include(t => t.t_views)
                                          .Include(t => t.t_instructions)
                                          .Where(m => m.id_article == id_article)
                                          .FirstOrDefaultAsync();

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View(t_article);

        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductInstruction(long id_article, long id_instruct, int id_view, string title, string short_description, long display_order, string memo)
        {
            /*
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }*/

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_instructions.FindAsync(id_article, id_instruct);
                    if (target == null)
                    {
                        // if object is not in table
                        // do add new item acrion
                        t_instruction t_instruction = new t_instruction();
                        t_instruction.id_article = id_article;
                        t_instruction.id_instruct = id_instruct;
                        t_instruction.id_view = id_view;
                        t_instruction.title = title;
                        t_instruction.short_description = short_description;
                        t_instruction.display_order = display_order;
                        t_instruction.memo = memo;

                        await _context.AddAsync(t_instruction);
                        await _context.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditProductInstruction", new { id_article = id_article });
                    } else
                    {
                        // if object is in table
                        // do update new item acrion
                        target.id_view = id_view;
                        target.title = title;
                        target.short_description = short_description;
                        target.display_order = display_order;
                        target.memo = memo;

                        // Update Db
                        await _context.SaveChangesAsync();


                        TempData["ResultMsg"] = "Update Success";
                        return RedirectToAction("EditProductInstruction", new { id_article = id_article });
                    }


                }
                catch(Exception e)
                {
                    TempData["ResultMsg"] = "Update Failed";
#if DEBUG
                    TempData["ResultMsg"] = e.Message;
#endif
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

            /*
            if (id_article == null | id_view == null)
            {
                return NotFound();
            }
            */

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_views.FindAsync(id_article, id_view);
                    if (target == null)
                    {
                        //if target does not find, update new item

                        t_view t_view = new t_view();
                        // Key data
                        t_view.id_article = id_article;
                        t_view.id_view = id_view;
                        t_view.title = title;
                        //Camera Position
                        t_view.cam_pos_x = cam_pos_x;
                        t_view.cam_pos_y = cam_pos_y;
                        t_view.cam_pos_z = cam_pos_z;

                        //Lookat
                        t_view.cam_lookat_x = cam_lookat_x;
                        t_view.cam_lookat_y = cam_lookat_y;
                        t_view.cam_lookat_z = cam_lookat_z;

                        //quatunion of camera
                        t_view.cam_quat_x = cam_quat_x;
                        t_view.cam_quat_y = cam_quat_y;
                        t_view.cam_quat_z = cam_quat_z;
                        t_view.cam_quat_w = cam_quat_w;

                        //OrbitControl Target
                        t_view.obt_target_x = obt_target_x;
                        t_view.obt_target_y = obt_target_y;
                        t_view.obt_target_z = obt_target_z;

                        // Update DB

                        await _context.AddAsync(t_view);
                        await _context.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditProductInstruction", new { id_article = id_article });
                    } else
                    {

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

                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_article);
        }

        public static byte[] GetByteArrayFromStream(Stream sm)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                sm.CopyTo(ms);
                return ms.ToArray();
            }
        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult UpdateThumbnail(long id_article, string imgfilebin)
        {/*
            if (formFile == null)
            {
                TempData["ResultMsg"] = "New File Attach Failed";
                ViewBag.ResultMsg = TempData["ResultMsg"];
                return View();
            }*/

            try
            {
                t_attachment t_attachment = new t_attachment();


                t_attachment.name = "Thumbnail_"+ id_article;
                // ?? System.IO.Path.GetFileNameWithoutExtension(formFile.FileName);
                //                t_attachment.file_data = GetByteArrayFromStream(formFile.OpenReadStream());
                //t_attachment.file_data = System.Text.Encoding.ASCII.GetBytes(imgfilebin);
                //string result = System.Text.RegularExpressions.Regex.Replace(imgfilebin, @"^data:image/[a-zA-Z]+;base64,", string.Empty);
                string result = imgfilebin.Substring(imgfilebin.IndexOf(",") + 1);
                t_attachment.file_data = GetByteArrayFromStream(new System.IO.MemoryStream(System.Text.Encoding.UTF8.GetBytes(result)));
                t_attachment.file_data = Convert.FromBase64String(result);
                t_attachment.type_data = "image/jpeg";// formFile.ContentType;
                t_attachment.file_name = t_attachment.name + ".jpg";// formFile.FileName;
                t_attachment.file_length = result.Length;// formFile.Length;
                t_attachment.format_data = "jpeg";// format_data ?? System.IO.Path.GetExtension(formFile.FileName);
                
                //t_attachment.itemlink = itemlink;
                //t_attachment.license = license;
                //t_attachment.memo = memo;

                t_attachment.isActive = true;


                t_attachment.create_user = User.Identity.Name;
                t_attachment.create_datetime = DateTime.Now;
                t_attachment.latest_update_user = User.Identity.Name;
                t_attachment.latest_update_datetime = DateTime.Now;


                t_attachment.id_file = 1 + (_context.t_attachments
                                            .Where(t => t.id_file == t.id_file)
                                            .Max(t => (long?)t.id_file) ?? 0);

                _context.Add(t_attachment);

                t_article t_article = _context.t_articles.Find(id_article);

                t_article.id_attachment_for_eye_catch = t_attachment.id_file;


                _context.SaveChanges();

                TempData["ResultMsg"] = "New Eye Catch Setting Success";
                return RedirectToAction("EditProductInstruction", new { id_article = id_article });

            }



            catch (Exception e)
            {
                TempData["ResultMsg"] = "New Eye Catch Setting Failed";
#if DEBUG
                TempData["ResultMsg"] = e.Message;
#endif
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }



        //-------------------------------------------------------------------
        //アイテム追加
        // GET: t_assembly/Create
        public ActionResult CreateAssembly()
        {
            return View();
        }

        // POST: t_assembly/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAssembly([Bind("assy_name")] t_assembly t_assembly)
        {
            //if (ModelState.IsValid)
            try
            {
                long id = 1 + (await _context.t_assemblies
                                        .MaxAsync(t => (long?)t.id_assy) ?? 0);

                t_assembly.id_assy = id;

                await _context.AddAsync(t_assembly);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch (Exception e)
            {
#if DEBUG
                TempData["ResultMsg"] = e.Message;
#endif

            }
            return View(t_assembly);
        }


        public async Task<IActionResult> CreateInstancePart(long? id_assy)
        {
            t_instance_part t_instance_part = new t_instance_part();
            t_instance_part.id_assy = id_assy.Value;
            t_instance_part.id_assyNavigation = await _context.t_assemblies.FindAsync(id_assy);


            ViewData["id_part"] = new SelectList(_context.t_parts, "id_part", "part_number");





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
                long id = 1 + (await _context.t_instance_parts
                                        .Where(t => t.id_assy == t.id_assy)
                                        .MaxAsync(t => (long?)t.id_assy) ?? 0);

                t_instance_part.id_inst = id;
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