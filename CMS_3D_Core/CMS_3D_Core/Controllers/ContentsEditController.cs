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
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> CreateArticle()
        {


            t_article t_article = new t_article() { id_article = 0, id_assy=0 };

            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name");
            ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name");

            return View("EditArticleWholeContents", t_article);
        }

        /// <summary>
        /// Show Edit View of Articles
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> EditArticleWholeContents(long? id_article)
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

            if (t_article == null)
            {
                return NotFound();
            }


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


            var parameter_id_article = new SqlParameter
            {
                ParameterName = "id_article",
                SqlDbType = System.Data.SqlDbType.BigInt,
                Value = id_article,
            };

            var parameter_create_user = new SqlParameter
            {
                ParameterName = "create_user",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = User.Identity.Name,
            };
            var parameter_ans_result = new SqlParameter
            {
                ParameterName = "ans_result",
                SqlDbType = System.Data.SqlDbType.SmallInt,
                Direction = System.Data.ParameterDirection.Output
            };




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

                        await _context.Database
                            .ExecuteSqlRawAsync("EXEC [dbo].[annotation_display_add] @id_article,@create_user,@ans_result OUTPUT"
                            , parameter_id_article
                            , parameter_create_user
                            , parameter_ans_result);


                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
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
                        return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
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


        ///ContentsEdit/postTorokuData
        [HttpPost]
        public async Task<JsonResult> EditProductInstructionApi([FromBody] t_instruction _t_instruction)
        //public JsonResult postTorokuData([FromBody] t_instruction t_instruction)
        {


            string updatemode;
            string updateresult;

            var parameter_id_article = new SqlParameter
            {
                ParameterName = "id_article",
                SqlDbType = System.Data.SqlDbType.BigInt,
                Value = _t_instruction.id_article,
            };

            var parameter_create_user = new SqlParameter
            {
                ParameterName = "create_user",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = User.Identity.Name,
            };
            var parameter_ans_result = new SqlParameter
            {
                ParameterName = "ans_result",
                SqlDbType = System.Data.SqlDbType.SmallInt,
                Direction = System.Data.ParameterDirection.Output
            };




            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_instructions.FindAsync(_t_instruction.id_article, _t_instruction.id_instruct);
                    if (target == null)
                    {
                        // if object is not in table
                        // do add new item acrion
                        t_instruction t_instruction = new t_instruction();
                        t_instruction.id_article = _t_instruction.id_article;
                        t_instruction.id_instruct = _t_instruction.id_instruct;
                        t_instruction.id_view = _t_instruction.id_view;
                        t_instruction.title = _t_instruction.title;
                        t_instruction.short_description = _t_instruction.short_description;
                        t_instruction.display_order = _t_instruction.display_order;
                        t_instruction.memo = _t_instruction.memo;

                        await _context.AddAsync(t_instruction);
                        await _context.SaveChangesAsync();

                        await _context.Database
                            .ExecuteSqlRawAsync("EXEC [dbo].[annotation_display_add] @id_article,@create_user,@ans_result OUTPUT"
                            , parameter_id_article
                            , parameter_create_user
                            , parameter_ans_result);


                        //TempData["ResultMsg"] = "AddNew Success";
                        //return RedirectToAction("EditArticleWholeContents", new { id_article = _t_instruction.id_article });
                    }
                    else
                    {
                        // if object is in table
                        // do update new item acrion
                        target.id_view = _t_instruction.id_view;
                        target.title = _t_instruction.title;
                        target.short_description = _t_instruction.short_description;
                        target.display_order = _t_instruction.display_order;
                        target.memo = _t_instruction.memo;

                        // Update Db
                        await _context.SaveChangesAsync();


                        //TempData["ResultMsg"] = "Update Success";
                        //return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
                    }


                }
                catch (Exception e)
                {
                    TempData["ResultMsg"] = "Update Failed";
#if DEBUG
                    TempData["ResultMsg"] = e.Message;
#endif
                }
            }
            IList<object> objCollection = new List<object>();
            //foreach (var item in t)
            //{
                objCollection.Add(
                    new
                    {
                        updatemode = "add",
                        updateresult = "sucess",
                        type = "t_instruction",
                        id_article = _t_instruction.id_article,
                        id_instruct = _t_instruction.id_instruct,
                        id_view = _t_instruction.id_view,
                        title = _t_instruction.title,
                        short_description = _t_instruction.short_description,
                        display_order = _t_instruction.display_order,
                        memo = _t_instruction.memo
                    });
            //}



            return Json(objCollection);


            // 更新に失敗した場合、編集画面を再描画
            //return View(id_article);
        }
        /*
        public JsonResult postTorokuData([FromBody] t_instruction t_instruction)
        {
                var t = _context.t_annotation_displays
                        .Where(x => x.id_article == 1)
                        .ToList();

            IList<object> objCollection = new List<object>();

            objCollection.Add(
                new
                {
                    ans = "ok"
                });


            foreach (var item in t)
            {
                objCollection.Add(
                    new
                    {
                        type = "annotation_display",
                        id_article = item.id_article,
                        id_instruct = item.id_instruct,
                        id_annotation = item.id_annotation,
                        is_display = item.is_display
                    });
            }

            return Json(objCollection);
            //データベース接続処理等を記述する。
        }




        var t = _context.t_annotation_displays
                    .Where(x => x.id_article == 1)
                    .ToList();

        IList<object> objCollection = new List<object>();

        objCollection.Add(
                new
                {
                    ans = "ok"
                });


            foreach (var item in t)
            {
                objCollection.Add(
                    new
                    {
                        type = "annotation_display",
                        id_article = item.id_article,
                        id_instruct = item.id_instruct,
                        id_annotation = item.id_annotation,
                        is_display = item.is_display
});
            }

            return Json(objCollection);
            //データベース接続処理等を記述する。
        }
*/


        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductAnnotationDisplay(IList<t_annotation_display> list)
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
                    foreach(var m in list)
                    {
                        var target = await _context.t_annotation_displays.FindAsync(m.id_article, m.id_instruct, m.id_annotation);
                        target.is_display = m.is_display;
                    }



                    // Update Db
                    await _context.SaveChangesAsync();


                    TempData["ResultMsg"] = "Update Success";
                    return RedirectToAction("EditArticleWholeContents", new { id_article = list[0].id_article });



                }
                catch (Exception e)
                {
                    TempData["ResultMsg"] = "Update Failed";
#if DEBUG
                    TempData["ResultMsg"] = e.Message;
#endif
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(list[0].id_article);
        }
        




        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductAnnotation(long id_article, long id_annotation, string title, string description1, string description2, short status, float pos_x, float pos_y, float pos_z)
        {
            /*
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }*/


            var parameter_id_article = new SqlParameter
            {
                ParameterName = "id_article",
                SqlDbType = System.Data.SqlDbType.BigInt,
                Value = id_article,
            };

            var parameter_create_user = new SqlParameter
            {
                ParameterName = "create_user",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = User.Identity.Name,
            };
            var parameter_ans_result = new SqlParameter
            {
                ParameterName = "ans_result",
                SqlDbType = System.Data.SqlDbType.SmallInt,
                Direction = System.Data.ParameterDirection.Output
            };




            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_annotations.FindAsync(id_article, id_annotation);
                    if (target == null)
                    {
                        // if object is not in table
                        // do add new item acrion
                        t_annotation t_annotation = new t_annotation();
                        t_annotation.id_article = id_article;
                        t_annotation.id_annotation = id_annotation;
                        t_annotation.title = title;
                        t_annotation.description1 = description1;
                        t_annotation.description2 = description2;
                        t_annotation.status = status;
                        t_annotation.pos_x = pos_x;
                        t_annotation.pos_y = pos_y;
                        t_annotation.pos_z = pos_z;

                        await _context.AddAsync(t_annotation);
                        await _context.SaveChangesAsync();

                        await _context.Database
                            .ExecuteSqlRawAsync("EXEC [dbo].[annotation_display_add] @id_article,@create_user,@ans_result OUTPUT"
                            , parameter_id_article
                            , parameter_create_user
                            , parameter_ans_result);


                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
                    }
                    else
                    {
                        // if object is in table
                        // do update new item acrion
                        target.title = title;
                        target.description1 = description1;
                        target.description2 = description2;
                        target.status = status;
                        target.pos_x = pos_x;
                        target.pos_y = pos_y;
                        target.pos_z = pos_z;

                        // Update Db
                        await _context.SaveChangesAsync();


                        TempData["ResultMsg"] = "Update Success";
                        return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
                    }


                }
                catch (Exception e)
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

            var x = await _context.t_annotation_displays.Where(y => y.id_article == id_article & y.id_instruct == id_instruct).ToListAsync();
            foreach(var s in x)
            {
                _context.t_annotation_displays.Remove(s);

            }

            t_instruction t_instruction = await _context.t_instructions.FindAsync(id_article, id_instruct);
            _context.t_instructions.Remove(t_instruction);
            await _context.SaveChangesAsync();

            TempData["ResultMsg"] = "Update Success";
            return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
        }
        // POST: t_instance_part/Delete/5
        [HttpPost, ActionName("DeleteProductAnnotation")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProductAnnotationConfirmed(long id_article, long id_annotation)
        {

            var x = await _context.t_annotation_displays.Where(y => y.id_article == id_article & y.id_annotation == y.id_annotation).ToListAsync();
            foreach (var s in x)
            {
                _context.t_annotation_displays.Remove(s);
            }

            t_annotation t_annotation = await _context.t_annotations.FindAsync(id_article, id_annotation);
            _context.t_annotations.Remove(t_annotation);
            await _context.SaveChangesAsync();

            TempData["ResultMsg"] = "Update Success";
            return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
        }
        /*
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

            
            //if (id_article == null | id_view == null)
            //{
            //    return NotFound();
            //}
            

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
                        return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });
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
                        return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });

                    }

                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_article);
        }*/

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


                t_article t_article = _context.t_articles.Find(id_article);


                t_attachment t_attachment = new t_attachment();


                t_attachment.name = "Thumbnail_" + (t_article.title ?? "") + "_" + id_article;
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


                t_article.id_attachment_for_eye_catch = t_attachment.id_file;


                _context.SaveChanges();

                TempData["ResultMsg"] = "New Eye Catch Setting Success";
                return RedirectToAction("EditArticleWholeContents", new { id_article = id_article });

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