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
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;



namespace CMS_3D_Core.Controllers
{



    [Authorize]
    public class ContentsOperatorForArticleApisController : ControllerBase
    {

        private readonly db_data_coreContext _context;

        public ContentsOperatorForArticleApisController(db_data_coreContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Return a set of related Data of article object in JSON
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IList<object>> GetArticleObjectWholeData(long id_article)
        {
            var t = await _context.t_articles
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts)
                        .Include(x => x.t_annotations)
                        .Include(x => x.t_lights)
                        .FirstOrDefaultAsync(x => x.id_article == id_article);

            IList<object> objCollection = new List<object>();

            //Article
            objCollection.Add(object_from_t_article(t));

            //Instance
            foreach (var item in t.id_assyNavigation.t_instance_parts)
            {
                objCollection.Add(object_from_t_instance_part(item));
            }

            //Instruction
            foreach (var item in t.t_instructions.OrderBy(x => x.display_order))
            {
                objCollection.Add(object_from_t_instruction(item));
            }

            //View
            foreach (var item in t.t_views)
            {
                objCollection.Add(object_from_t_view(item));
            }

            //annotation
            foreach (var item in t.t_annotations)
            {
                objCollection.Add(object_from_t_annotation(item));
            }


            //annotation disylay
            var t2 = await _context.t_annotation_displays
            .Where(x => x.id_article == id_article)
            .ToListAsync();


            foreach (var item in t2)
            {
                objCollection.Add(object_from_t_annotation_display(item));
            }


            //light
            foreach (var item in t.t_lights)
            {
                objCollection.Add(object_from_t_light(item));
            }



            //-------
            //Article Rererence
            //Eventually, I want to change it to a form that does not include the actual data of the model, so I will cut it out for the time being
            var t3 = await _context.t_articles
                                .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts).ThenInclude(x => x.id_partNavigation)
                                .Where(m => m.id_article == id_article).FirstOrDefaultAsync();



            foreach (var item in t3.id_assyNavigation.t_instance_parts)
            {
                objCollection.Add(object_from_refelencematerial(item));
            }

            //-------




            return objCollection;
        }



        /// <summary>
        /// Return Data of article(only article object) object in JSON
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<object> GetArticleObject(long id_article)
        {
            var t = await _context.t_articles
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts)
                        .FirstOrDefaultAsync(x => x.id_article == id_article);


            return object_from_t_article(t);
        }



        /// <summary>
        /// GET : Return Json of t_instance_part
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<t_instance_part>>> GetInstancePartList(int id_article)
        {
            var t = await _context.t_instance_parts
                        .ToListAsync();
            return t;
        }


        /// <summary>
        /// GET: Objects of Instruct Data with Json Format
        /// </summary>
        /// <param name="id_article">id_article</param>
        /// <returns>ファイルのJsonデータ</returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IList<object>> GetAssemblyObjectList(int id_article)
        {
            var t = await _context.t_articles
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts)
                        .FirstOrDefaultAsync(x => x.id_article == id_article);

            IList<object> objCollection = new List<object>();

            foreach (var item in t.id_assyNavigation.t_instance_parts)
            {
                objCollection.Add(object_from_t_instance_part(item));
                /*objCollection.Add(
                    new
                    {
                        type = "instance_part",
                        id_assy = item.id_assy,
                        id_inst = item.id_inst,
                        id_part = item.id_part
                    });*/
            }

            foreach (var item in t.t_instructions.OrderBy(x => x.display_order))
            {
                objCollection.Add(object_from_t_instruction(item));
                /*
                objCollection.Add(
                    new
                    {
                        type = "instruction",
                        id_article = item.id_article,
                        id_instruct = item.id_instruct,
                        id_view = item.id_view,
                        title = item.title,
                        short_description = item.short_description,
                        memo = item.memo,
                        display_order = item.display_order
                    });
                */
            }

            foreach (var item in t.t_views)
            {
                objCollection.Add(object_from_t_view(item));
            }

            return objCollection;
        }



        /// <summary>
        /// Return Instance Lists with Jeson Formats
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IList<object>> GetAssemblyObjectListOnlyInstance(int id_assy)
        {
            var t = await _context.t_assemblies
                        .Include(x => x.t_instance_parts)
                        .FirstOrDefaultAsync(x => x.id_assy == id_assy);

            IList<object> objCollection = new List<object>();

            foreach (var item in t.t_instance_parts)
            {
                objCollection.Add(object_from_t_instance_part(item));
                /*
                objCollection.Add(
                    new
                    {
                        type = "instance_part",
                        id_assy = item.id_assy,
                        id_inst = item.id_inst,
                        id_part = item.id_part
                    });
                */
            }



            return objCollection;
        }


        /// <summary>
        /// GET: Rerutn Annotation Data with Json Formats
        /// </summary>
        /// <param name="id_article">ArticleID</param>
        /// <returns>Json Data of File</returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IList<object>> GetAnnotationObjectList(int id_article)
        {
            var t = await _context.t_annotations
                        .Where(x => x.id_article == id_article)
                        .ToListAsync();

            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
                objCollection.Add(object_from_t_annotation(item));
            }



            return objCollection;
        }



        /// <summary>
        /// GET: Rerutn Annotation Data with Json Formats
        /// </summary>
        /// <param name="id_article">ArticleID</param>
        /// <returns>Json Data of Annotation</returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IList<object>> GetAnnotationDisplayObjectList(int id_article)
        {
            var t = await _context.t_annotation_displays
                        .Where(x => x.id_article == id_article)
                        .ToListAsync();

            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
                objCollection.Add(object_from_t_annotation_display(item));
                /*
                objCollection.Add(
                    new
                    {
                        type = "annotation_display",
                        id_article = item.id_article,
                        id_instruct = item.id_instruct,
                        id_annotation = item.id_annotation,
                        is_display = item.is_display
                    });*/
            }



            return objCollection;
        }


        /// <summary>
        /// GET: Rerutn File Data with File Object Formats
        /// </summary>
        /// <param name="id_part"></param>
        /// <returns>File Data</returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetPartObjectFile(long id_part)
        {
            t_part t_part = await _context.t_parts.FindAsync(id_part);

            return File(t_part.file_data, t_part.type_data, t_part.part_number);
        }


        /// <summary>
        /// Return a set of Model or Picture reference Data of article object in JSON
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IList<object>> GetArticleReferenceData(long id_article)
        {

            var t = await _context.t_articles
                                .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts).ThenInclude(x => x.id_partNavigation)
                                .Where(m => m.id_article == id_article).FirstOrDefaultAsync();

            IList<object> objCollection = new List<object>();

            //Article

            foreach(var item in t.id_assyNavigation.t_instance_parts)
            {
                objCollection.Add(object_from_refelencematerial(item));
            }
            
            return objCollection;
        }





        /// <summary>
        /// Update AnnotationDisplay for Ajax
        /// </summary>
        /// <param name="list"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductArticleApi([FromBody] t_article _t_article)
        {
            /*
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }*/

            string updatemode = "Undefined";
            string updateresult = "Failed";
            string updateresult_msg = "Failed";





            if (ModelState.IsValid)
            {
                try
                {
                    updatemode = "undefined";
                    var target = await _context.t_articles.FindAsync(_t_article.id_article);


                    if (target == null)
                    {
                        // if object is not in table
                        // do add new item acrion
                        t_article t_article = new t_article();


                        t_article.id_article = _t_article.id_article;
                        t_article.title = _t_article.title;
                        t_article.short_description = _t_article.short_description;


                        t_article.long_description = _t_article.long_description;
                        t_article.meta_description = _t_article.meta_description;
                        t_article.meta_category = _t_article.meta_category;

                        t_article.status = _t_article.status;

                        t_article.gammaOutput = _t_article.gammaOutput;
                        t_article.id_attachment_for_eye_catch = _t_article.id_attachment_for_eye_catch;


                        t_article.bg_c = _t_article.bg_c;
                        t_article.bg_h = _t_article.bg_h;
                        t_article.bg_s = _t_article.bg_s;
                        t_article.bg_l = _t_article.bg_l;
                        t_article.isStarrySky = _t_article.isStarrySky;


                        t_article.create_user = User.Identity.Name;
                        t_article.create_datetime = DateTime.Now;

                        await _context.AddAsync(t_article);

                        await _context.SaveChangesAsync();

                        updatemode = "AddNew";
                        updateresult = "Success";
                        updateresult_msg = "AddNew Success";
                    }
                    else
                    {
                        // if object is in table
                        // do update new item acrion
                        target.title = _t_article.title;
                        target.short_description = _t_article.short_description;


                        target.long_description = _t_article.long_description;
                        target.meta_description = _t_article.meta_description;
                        target.meta_category = _t_article.meta_category;

                        target.status = _t_article.status;

                        target.gammaOutput = _t_article.gammaOutput;
                        target.id_attachment_for_eye_catch = _t_article.id_attachment_for_eye_catch;


                        target.bg_c = _t_article.bg_c;
                        target.bg_h = _t_article.bg_h;
                        target.bg_s = _t_article.bg_s;
                        target.bg_l = _t_article.bg_l;
                        target.isStarrySky = _t_article.isStarrySky;



                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;

                        // Update Db
                        await _context.SaveChangesAsync();


                        updatemode = "Update";
                        updateresult = "Success";
                        updateresult_msg = "Update Success";
                    }


                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Failed";
#if DEBUG
                    updateresult_msg = e.Message;
#endif
                }
            }


            IList<object> objCollection = new List<object>();


            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg
                });

            return objCollection;
        }





        /// <summary>
        /// Update or Add Instruction for Ajax
        /// </summary>
        /// <param name="_t_instruction"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductInstructionApi([FromBody] t_instruction _t_instruction)
        {


            string updatemode="";
            string updateresult="";
            string updateresult_msg="";

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
                    updatemode = "undefined";
                    var target = await _context.t_instructions.FindAsync(_t_instruction.id_article, _t_instruction.id_instruct);

                    var t_article = await _context.t_articles.FindAsync(_t_instruction.id_article);

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
                        t_instruction.create_user = User.Identity.Name;
                        t_instruction.create_datetime = DateTime.Now;

                        await _context.AddAsync(t_instruction);

                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;

                        await _context.SaveChangesAsync();

                        await _context.Database
                            .ExecuteSqlRawAsync("EXEC [dbo].[annotation_display_add] @id_article,@create_user,@ans_result OUTPUT"
                            , parameter_id_article
                            , parameter_create_user
                            , parameter_ans_result);


                        updatemode = "AddNew";
                        updateresult = "Success";
                        updateresult_msg = "AddNew Success";
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
                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;

                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;

                        // Update Db
                        await _context.SaveChangesAsync();


                        updatemode = "Update";
                        updateresult = "Success";
                        updateresult_msg = "Update Success";
                    }


                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Failed";
#if DEBUG
                    updateresult_msg = e.Message;
#endif
                }
            }
            IList<object> objCollection = new List<object>();
            //foreach (var item in t)
            //{
            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,
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



            return objCollection;
        }



        /// <summary>
        /// Delete Instruction for Ajax API
        /// </summary>
        /// <param name="_t_instruction"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> DeleteProductInstructionApi([FromBody] t_instruction _t_instruction)
        {

            string updatemode = "Delete";
            string updateresult = "Success";
            string updateresult_msg = "Delete Success";
            var x = await _context.t_annotation_displays.Where(y => y.id_article == _t_instruction.id_article & y.id_instruct == _t_instruction.id_instruct).ToListAsync();
            foreach (var s in x)
            {
                _context.t_annotation_displays.Remove(s);

            }

            t_instruction t_instruction = await _context.t_instructions.FindAsync(_t_instruction.id_article, _t_instruction.id_instruct);
            _context.t_instructions.Remove(t_instruction);



            var t_article = await _context.t_articles.FindAsync(_t_instruction.id_article);
            t_article.latest_update_user = User.Identity.Name;
            t_article.latest_update_datetime = DateTime.Now;

            await _context.SaveChangesAsync();



            IList<object> objCollection = new List<object>();
            //foreach (var item in t)
            //{
            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,
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



            return objCollection;

        }



        /// <summary>
        /// Update or Add View for Ajax
        /// </summary>
        /// <param name="_t_view"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductViewApi([FromBody] t_view _t_view)
        {



            string updatemode = "";
            string updateresult = "";
            string updateresult_msg = "";

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_views.FindAsync(_t_view.id_article, _t_view.id_view);

                    var t_article = await _context.t_articles.FindAsync(_t_view.id_article);

                    if (target == null)
                    {
                        //if target does not find, update new item

                        t_view t_view = new t_view();
                        // Key data
                        t_view.id_article = _t_view.id_article;
                        t_view.id_view = _t_view.id_view;
                        t_view.title = _t_view.title;
                        //Camera Position
                        t_view.cam_pos_x = _t_view.cam_pos_x;
                        t_view.cam_pos_y = _t_view.cam_pos_y;
                        t_view.cam_pos_z = _t_view.cam_pos_z;

                        //Lookat
                        t_view.cam_lookat_x = _t_view.cam_lookat_x;
                        t_view.cam_lookat_y = _t_view.cam_lookat_y;
                        t_view.cam_lookat_z = _t_view.cam_lookat_z;

                        //quatunion of camera
                        t_view.cam_quat_x = _t_view.cam_quat_x;
                        t_view.cam_quat_y = _t_view.cam_quat_y;
                        t_view.cam_quat_z = _t_view.cam_quat_z;
                        t_view.cam_quat_w = _t_view.cam_quat_w;

                        //OrbitControl Target
                        t_view.obt_target_x = _t_view.obt_target_x;
                        t_view.obt_target_y = _t_view.obt_target_y;
                        t_view.obt_target_z = _t_view.obt_target_z;


                        t_view.create_user = User.Identity.Name;
                        t_view.create_datetime = DateTime.Now;


                        // Update DB

                        await _context.AddAsync(t_view);



                        //Update Article User / datetime
                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;


                        await _context.SaveChangesAsync();


                        updatemode = "AddNew";
                        updateresult = "Success";
                        updateresult_msg = "AddNew Success";

                        //TempData["ResultMsg"] = "AddNew Success";
                        //return RedirectToAction("EditArticleWholeContents", "ContentsEdit", new { id_article = id_article });
                    }
                    else
                    {

                        // データ更新
                        target.title = _t_view.title;
                        //カメラ位置
                        target.cam_pos_x = _t_view.cam_pos_x;
                        target.cam_pos_y = _t_view.cam_pos_y;
                        target.cam_pos_z = _t_view.cam_pos_z;

                        //Lookat(現状まともに動いていない)
                        target.cam_lookat_x = _t_view.cam_lookat_x;
                        target.cam_lookat_y = _t_view.cam_lookat_y;
                        target.cam_lookat_z = _t_view.cam_lookat_z;

                        //カメラのクオータニオン
                        target.cam_quat_x = _t_view.cam_quat_x;
                        target.cam_quat_y = _t_view.cam_quat_y;
                        target.cam_quat_z = _t_view.cam_quat_z;
                        target.cam_quat_w = _t_view.cam_quat_w;

                        //OrbitControlのターゲット
                        target.obt_target_x = _t_view.obt_target_x;
                        target.obt_target_y = _t_view.obt_target_y;
                        target.obt_target_z = _t_view.obt_target_z;



                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;

                        //Update Article User / datetime
                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;


                        // DBに更新を反映
                        await _context.SaveChangesAsync();

                        updatemode = "Update";
                        updateresult = "Success";
                        updateresult_msg = "Update Success";

                        //TempData["ResultMsg"] = "Update Success";
                        //return RedirectToAction("EditArticleWholeContents", "ContentsEdit", new { id_article = id_article });

                    }

                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Update Failed";
                    //TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            // return View(id_article);


            IList<object> objCollection = new List<object>();


            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,
                    type = "t_view",
                    // Key data
                    id_article = _t_view.id_article,
                    id_view = _t_view.id_view,
                    title = _t_view.title,
                    //Camera Position
                    cam_pos_x = _t_view.cam_pos_x,
                    cam_pos_y = _t_view.cam_pos_y,
                    cam_pos_z = _t_view.cam_pos_z,

                    //Lookat
                    cam_lookat_x = _t_view.cam_lookat_x,
                    cam_lookat_y = _t_view.cam_lookat_y,
                    cam_lookat_z = _t_view.cam_lookat_z,

                    //quatunion of camera
                    cam_quat_x = _t_view.cam_quat_x,
                    cam_quat_y = _t_view.cam_quat_y,
                    cam_quat_z = _t_view.cam_quat_z,
                    cam_quat_w = _t_view.cam_quat_w,

                    //OrbitControl Target
                    obt_target_x = _t_view.obt_target_x,
                    obt_target_y = _t_view.obt_target_y,
                    obt_target_z = _t_view.obt_target_z
                });

            return objCollection;



        }



        /// <summary>
        /// Delete View for Ajax API
        /// </summary>
        /// <param name="_t_view"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> DeleteProductViewApi([FromBody] t_view _t_view)
        {

            string updatemode = "Delete";
            string updateresult = "Success";
            string updateresult_msg = "Delete Success";


            t_view t_view = await _context.t_views.FindAsync(_t_view.id_article, _t_view.id_view);
            _context.t_views.Remove(t_view);




            var t_article = await _context.t_articles.FindAsync(_t_view.id_article);
            t_article.latest_update_user = User.Identity.Name;
            t_article.latest_update_datetime = DateTime.Now;


            await _context.SaveChangesAsync();



            IList<object> objCollection = new List<object>();
            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg
                });

            return objCollection;

        }


        /// <summary>
        /// Update or Add Annotation for Ajax
        /// </summary>
        /// <param name="_t_annotation"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductAnnotationApi([FromBody] t_annotation _t_annotation)
        {
            /*
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }*/

        string updatemode = "";
            string updateresult = "";
            string updateresult_msg = "";

            var parameter_id_article = new SqlParameter
            {
                ParameterName = "id_article",
                SqlDbType = System.Data.SqlDbType.BigInt,
                Value = _t_annotation.id_article,
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
                    updatemode = "undefined";
                    var target = await _context.t_annotations.FindAsync(_t_annotation.id_article, _t_annotation.id_annotation);
                    var t_article = await _context.t_articles.FindAsync(_t_annotation.id_article);

                    if (target == null)
                    {
                        // if object is not in table
                        // do add new item acrion
                        t_annotation t_annotation = new t_annotation();
                        t_annotation.id_article = _t_annotation.id_article;
                        t_annotation.id_annotation = _t_annotation.id_annotation;
                        t_annotation.title = _t_annotation.title;
                        t_annotation.description1 = _t_annotation.description1;
                        t_annotation.description2 = _t_annotation.description2;
                        t_annotation.status = _t_annotation.status;
                        t_annotation.pos_x = _t_annotation.pos_x;
                        t_annotation.pos_y = _t_annotation.pos_y;
                        t_annotation.pos_z = _t_annotation.pos_z;


                        t_annotation.create_user = User.Identity.Name;
                        t_annotation.create_datetime = DateTime.Now;

                        await _context.AddAsync(t_annotation);




                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;
                        await _context.SaveChangesAsync();

                        await _context.Database
                            .ExecuteSqlRawAsync("EXEC [dbo].[annotation_display_add] @id_article,@create_user,@ans_result OUTPUT"
                            , parameter_id_article
                            , parameter_create_user
                            , parameter_ans_result);



                        updatemode = "AddNew";
                        updateresult = "Success";
                        updateresult_msg = "AddNew Success";
                    }
                    else
                    {
                        // if object is in table
                        // do update new item acrion
                        target.title = _t_annotation.title;
                        target.description1 = _t_annotation.description1;
                        target.description2 = _t_annotation.description2;
                        target.status = _t_annotation.status;
                        target.pos_x = _t_annotation.pos_x;
                        target.pos_y = _t_annotation.pos_y;
                        target.pos_z = _t_annotation.pos_z;


                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;


                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;

                        // Update Db
                        await _context.SaveChangesAsync();


                        updatemode = "Update";
                        updateresult = "Success";
                        updateresult_msg = "Update Success";
                    }


                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Failed";
#if DEBUG
                    updateresult_msg = e.Message;
#endif
                }
            }


            IList<object> objCollection = new List<object>();


            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,
                    type = "t_annotation",
                    id_article = _t_annotation.id_article,
                    id_annotation = _t_annotation.id_annotation,
                    title = _t_annotation.title,
                    description1 = _t_annotation.description1,
                    description2 = _t_annotation.description2,
                    status = _t_annotation.status,
                    pos_x = _t_annotation.pos_x,
                    pos_y = _t_annotation.pos_y,
                    pos_z = _t_annotation.pos_z
                });

            return objCollection;
        }


        /// <summary>
        /// Delete Annotation for Ajax API
        /// </summary>
        /// <param name="_t_annotation"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> DeleteProductAnnotationApi([FromBody] t_annotation _t_annotation)
        {

            string updatemode = "Delete";
            string updateresult = "Success";
            string updateresult_msg = "Delete Success";


            var x = await _context.t_annotation_displays.Where(y => y.id_article == _t_annotation.id_article & y.id_annotation == _t_annotation.id_annotation).ToListAsync();
            foreach (var s in x)
            {
                _context.t_annotation_displays.Remove(s);
            }

            t_annotation t_annotation = await _context.t_annotations.FindAsync(_t_annotation.id_article, _t_annotation.id_annotation);
            _context.t_annotations.Remove(t_annotation);



            var t_article = await _context.t_articles.FindAsync(_t_annotation.id_article);
            t_article.latest_update_user = User.Identity.Name;
            t_article.latest_update_datetime = DateTime.Now;

            await _context.SaveChangesAsync();



            IList<object> objCollection = new List<object>();
            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,
                    type = "t_annotation",
                    id_article = _t_annotation.id_article,
                    id_annotation = _t_annotation.id_annotation,
                    title = _t_annotation.title,
                    description1 = _t_annotation.description1,
                    description2 = _t_annotation.description2,
                    status = _t_annotation.status,
                    pos_x = _t_annotation.pos_x,
                    pos_y = _t_annotation.pos_y,
                    pos_z = _t_annotation.pos_z
                });

            return objCollection;

        }


        /// <summary>
        /// Update AnnotationDisplay for Ajax
        /// </summary>
        /// <param name="list"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductAnnotationDisplayApi([FromBody] IList<t_annotation_display> List)
        {
            /*
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }*/

            string updatemode = "Delete";
            string updateresult = "Success";
            string updateresult_msg = "Delete Success";

            if (ModelState.IsValid)
            {
                updatemode = "undefined";
                try
                {
                    var t_article = await _context.t_articles.FindAsync(List.FirstOrDefault().id_article);

                    foreach (var m in List)
                    {
                        var target = await _context.t_annotation_displays.FindAsync(m.id_article, m.id_instruct, m.id_annotation);
                        target.is_display = m.is_display;
                        target.is_display_description = m.is_display_description;
                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;
                    }



                    t_article.latest_update_user = User.Identity.Name;
                    t_article.latest_update_datetime = DateTime.Now;

                    // Update Db
                    await _context.SaveChangesAsync();


                    updatemode = "Update";
                    updateresult = "Success";
                    updateresult_msg = "Update Success";


                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Failed";
#if DEBUG
                    updateresult_msg = e.Message;
#endif
                }
            }

            IList<object> objCollection = new List<object>();


            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg
                });

            return objCollection;
        }


        /// <summary>
        /// Update Instance for Ajax
        /// </summary>
        /// <param name="list"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductInstanceApi([FromBody] IList<t_instance_part> List)
        {
            /*
            if (id_article == null | id_instruct == null)
            {
                return NotFound();
            }*/

            string updatemode = "undefined";
            string updateresult = "Failed";
            string updateresult_msg = "Failed";

            if (ModelState.IsValid)
            {
                updatemode = "undefined";
                try
                {
                    var t_assembly = await _context.t_assemblies.FindAsync(List.FirstOrDefault().id_assy);

                    foreach (var m in List)
                    {
                        var target = await _context.t_instance_parts.FindAsync(m.id_assy, m.id_inst);
                        target.pos_x = m.pos_x;
                        target.pos_y = m.pos_y;
                        target.pos_z = m.pos_z;
                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;
                    }



                    t_assembly.latest_update_user = User.Identity.Name;
                    t_assembly.latest_update_datetime = DateTime.Now;

                    // Update Db
                    await _context.SaveChangesAsync();


                    updatemode = "Update";
                    updateresult = "Success";
                    updateresult_msg = "Update Success";


                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Failed";
#if DEBUG
                    updateresult_msg = e.Message;
#endif
                }
            }

            IList<object> objCollection = new List<object>();


            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg
                });

            return objCollection;
        }


        /// <summary>
        /// Update or Add Light for Ajax
        /// </summary>
        /// <param name="_t_light"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditProductLightApi([FromBody] t_light _t_light)
        {



            string updatemode = "";
            string updateresult = "";
            string updateresult_msg = "";

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_lights.FindAsync(_t_light.id_article, _t_light.id_light);

                    var t_article = await _context.t_articles.FindAsync(_t_light.id_article);

                    if (target == null)
                    {
                        //if target does not find, update new item

                        t_light t_light = new t_light();

                        // Key data
                        t_light.id_article = _t_light.id_article;
                        t_light.id_light = _t_light.id_light;
                        t_light.light_type = _t_light.light_type;
                        t_light.title = _t_light.title;
                        t_light.short_description = _t_light.short_description;

                        //Camera Position

                        t_light.color = _t_light.color;
                        t_light.intensity = _t_light.intensity;

                        t_light.px = _t_light.px;
                        t_light.py = _t_light.py;
                        t_light.pz = _t_light.pz;


                        t_light.distance = _t_light.distance;
                        t_light.decay = _t_light.decay;
                        t_light.power = _t_light.power;
                        t_light.shadow = _t_light.shadow;

                        t_light.tx = _t_light.tx;
                        t_light.ty = _t_light.ty;
                        t_light.tz = _t_light.tz;

                        t_light.skycolor = _t_light.skycolor;
                        t_light.groundcolor = _t_light.groundcolor;

                        t_light.is_lensflare = _t_light.is_lensflare;
                        t_light.lfsize = _t_light.lfsize;
                        t_light.file_data = _t_light.file_data;



                        t_light.create_user = User.Identity.Name;
                        t_light.create_datetime = DateTime.Now;


                        // Update DB

                        await _context.AddAsync(t_light);



                        //Update Article User / datetime
                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;


                        await _context.SaveChangesAsync();


                        updatemode = "AddNew";
                        updateresult = "Success";
                        updateresult_msg = "AddNew Success";

                    }
                    else
                    {

                        target.light_type = _t_light.light_type;
                        target.title = _t_light.title;
                        target.short_description = _t_light.short_description;

                        //Camera Position

                        target.color = _t_light.color;
                        target.intensity = _t_light.intensity;

                        target.px = _t_light.px;
                        target.py = _t_light.py;
                        target.pz = _t_light.pz;


                        target.distance = _t_light.distance;
                        target.decay = _t_light.decay;
                        target.power = _t_light.power;
                        target.shadow = _t_light.shadow;

                        target.tx = _t_light.tx;
                        target.ty = _t_light.ty;
                        target.tz = _t_light.tz;

                        target.skycolor = _t_light.skycolor;
                        target.groundcolor = _t_light.groundcolor;

                        target.is_lensflare = _t_light.is_lensflare;
                        target.lfsize = _t_light.lfsize;
                        target.file_data = _t_light.file_data;



                        target.latest_update_user = User.Identity.Name;
                        target.latest_update_datetime = DateTime.Now;

                        //Update Article User / datetime
                        t_article.latest_update_user = User.Identity.Name;
                        t_article.latest_update_datetime = DateTime.Now;


                        // DBに更新を反映
                        await _context.SaveChangesAsync();

                        updatemode = "Update";
                        updateresult = "Success";
                        updateresult_msg = "Update Success";


                    }

                }
                catch (Exception e)
                {
                    updateresult = "Failed";
                    updateresult_msg = "Update Failed";
                    //TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            // return View(id_article);


            IList<object> objCollection = new List<object>();







            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,

                });

            return objCollection;



        }

        //===============================================================================================
        // Methods for dropdownlist

        /// <summary>GET: サブプロジェクト一覧をJSONで返す(p_idで絞り込み)</summary>
        /// <param name="p_id">p_id(プロジェクトのid)</param>
        /// <returns>結果のJSON</returns>
        /// 
        /// <summary>
        /// 
        /// </summary>
        /// <param name="_t_light"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        //        [ValidateAntiForgeryToken]
        //public async Task<IList<object>> testGetListForDropDownGeneral([FromBody] long id_article)
        public async Task<IList<object>> testGetListForDropDownGeneral(long id_article)
        {
            //long id_article = 1;

            IList<object> ListForDropDownGeneral = new List<object>();


            var t_views = _context.t_views
                                  .Where(x => x.id_article == id_article)
                                  .OrderBy(x => x.id_article)
                                  .ToList();


            foreach (var item in t_views)
            {
                ListForDropDownGeneral.Add(new { value = item.id_view, text = "ID:[" + item.id_view + "]" + item.title });
            }

            return ListForDropDownGeneral;
        }

        //===============================================================================================
        /// <summary>
        /// return object with t_article
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        private static object object_from_t_article(t_article t) =>
            new
            {
                type = "article",
                id_article = t.id_article,
                id_assy = t.id_assy,
                title = t.title,
                short_description = t.short_description,
                long_description = t.long_description,
                meta_description = t.meta_description,
                meta_category = t.meta_category,
                status = t.status,
                directional_light_color = t.directional_light_color,
                directional_light_intensity = t.directional_light_intensity,

                directional_light_px = t.directional_light_px,
                directional_light_py = t.directional_light_py,
                directional_light_pz = t.directional_light_pz,

                ambient_light_color = t.ambient_light_color,
                ambient_light_intensity = t.ambient_light_intensity,
                gammaOutput = t.gammaOutput,


                bg_c = t.bg_c,
                bg_h = t.bg_h,
                bg_s = t.bg_s,
                bg_l = t.bg_l,

                id_attachment_for_eye_catch = t.id_attachment_for_eye_catch,
                isStarrySky = t.isStarrySky
            };


        /// <summary>
        /// return object with t_instruction
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_instruction(t_instruction item) =>
            new
            {
                type = "instruction",
                id_article = item.id_article,
                id_instruct = item.id_instruct,
                id_view = item.id_view,
                title = item.title,
                short_description = item.short_description,
                memo = item.memo,
                display_order = item.display_order
            };


        /// <summary>
        /// return object with t_view
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_view(t_view item) =>
            new
            {
                type = "view",
                id_article = item.id_article,
                id_view = item.id_view,
                title = item.title,

                cam_pos_x = item.cam_pos_x,
                cam_pos_y = item.cam_pos_y,
                cam_pos_z = item.cam_pos_z,

                cam_lookat_x = item.cam_lookat_x,
                cam_lookat_y = item.cam_lookat_y,
                cam_lookat_z = item.cam_lookat_z,

                cam_quat_x = item.cam_quat_x,
                cam_quat_y = item.cam_quat_y,
                cam_quat_z = item.cam_quat_z,
                cam_quat_w = item.cam_quat_w,

                obt_target_x = item.obt_target_x,
                obt_target_y = item.obt_target_y,
                obt_target_z = item.obt_target_z
            };


        /// <summary>
        /// return object with t_annotation
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_annotation(t_annotation item) =>
            new
            {
                type = "annotation",
                id_article = item.id_article,
                id_annotation = item.id_annotation,
                title = item.title,
                description1 = item.description1,
                description2 = item.description2,
                status = item.status,
                pos_x = item.pos_x,
                pos_y = item.pos_y,
                pos_z = item.pos_z
            };


        /// <summary>
        /// return object with t_annotation_display
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_annotation_display(t_annotation_display item) =>
            new
            {
                type = "annotation_display",
                id_article = item.id_article,
                id_instruct = item.id_instruct,
                id_annotation = item.id_annotation,
                is_display = item.is_display,
                is_display_description = item.is_display_description
            };


        /// <summary>
        /// return object with t_instance_part
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_instance_part(t_instance_part item) =>
            new
            {
                type = "instance_part",
                id_assy = item.id_assy,
                id_inst = item.id_inst,
                id_part = item.id_part,
                pos_x = item.pos_x,
                pos_y = item.pos_y,
                pos_z = item.pos_z

            };

        /// <summary>
        /// return object from t_instance_part for material list
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_light(t_light item) =>
            new
            {
                type = "light",
                model_name = "Model Name",


                id_article = item.id_article,
                id_light = item.id_light,
                light_type = item.light_type,
                title = item.title,
                short_description = item.short_description,
                color = item.color,
                intensity = item.intensity,
                px = item.px,
                py = item.py,
                pz = item.pz,
                distance = item.distance,
                decay = item.decay,
                power = item.power,
                shadow = item.shadow,
                tx = item.tx,
                ty = item.ty,
                tz = item.tz,
                skycolor = item.groundcolor,
                groundcolor = item.groundcolor,
                is_lensflare = item.is_lensflare,
                lfsize = item.lfsize,
                file_data = item.file_data

            };

        /// <summary>
        /// return object from t_instance_part for material list
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_refelencematerial(t_instance_part item) =>
            new
            {
                type = "refelencematerial",
                model_name = "Model Name",
                id_assy = item.id_assy,
                id_inst = item.id_inst,
                id_part = item.id_part,
                file_name = item.id_partNavigation.file_name,
                file_length = item.id_partNavigation.file_length,
                itemlink = item.id_partNavigation.itemlink,
                author = item.id_partNavigation.author,
                license = item.id_partNavigation.license
            };
    }



}
 