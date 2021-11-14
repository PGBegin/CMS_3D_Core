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
                /*
                objCollection.Add(
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
                    });*/
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

                id_attachment_for_eye_catch = t.id_attachment_for_eye_catch
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
                is_display = item.is_display
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
                id_part = item.id_part

            };

    }


    /*
    public class vm_instruction
    {
        public long id_article { get; set; }
        public long id_instruct { get; set; }
        public int id_view { get; set; }
        public string title { get; set; }
        public string short_description { get; set; }
        public string memo { get; set; }
        public long display_order { get; set; }
    }
    */
}
