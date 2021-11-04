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

namespace CMS_3D_Core.Controllers
{



    public class ContentsOperatorForArticleApisController : ControllerBase
    {

        private readonly db_data_coreContext _context;

        public ContentsOperatorForArticleApisController(db_data_coreContext context)
        {
            _context = context;
        }


        /// <summary>
        /// articleの関連情報を一括のJSONで返す
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
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
        /// articleの基本情報を返す
        /// </summary>
        /// <param name="id_article"></param>
        /// <returns></returns>
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
        /// GET: インスタンスリストをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
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
        /// <returns>ファイルのJsonデータ</returns>
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
        /// <returns>ファイルのJsonデータ</returns>
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


        ///ContentsEdit/postTorokuData
        [HttpPost]
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

        [HttpGet]
        public async Task<IActionResult> GetPartObjectFile(long id_part)
        {
            t_part t_part = await _context.t_parts.FindAsync(id_part);

            return File(t_part.file_data, t_part.type_data, t_part.part_number);
        }







        /// <summary>
        /// return object with t_view
        /// </summary>
        /// <param name="item"></param>
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
        /// return object with t_view
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
        /// return object with t_view
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

    }



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

}
