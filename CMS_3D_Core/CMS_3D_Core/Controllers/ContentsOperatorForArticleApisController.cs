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
        //private db_data_coreContext db = new db_data_coreContext();

        private readonly db_data_coreContext _context;

        public ContentsOperatorForArticleApisController(db_data_coreContext context)
        {
            _context = context;
        }


        //ContentsOperatorApis2/GetAssemblyObjectList/1
        /// <summary>
        /// GET: コンテンツのベースデータをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<vm_instruction>>> GetInstructionList(int id_article)
        {
            var t = await _context.t_instructions
                        .Where(x => x.id_article == id_article)
                        .Select(x => vm_instruction(x))
                        .ToListAsync();


            return t;
        }
        //ContentsOperatorApis2/GetAssemblyObjectList/1
        /// <summary>
        /// GET: コンテンツのベースデータをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<t_instance_part>>> GetInstancePartList(int id_article)
        {


            var t = await _context.t_instance_parts
                        //.Where(x => x.id_assyNavigation.t_articles.FirstOrDefault().id_article == id_article)
                        //                        .Where(x => x.id_assyNavigation.t_articles.Where(m => m.id_article == id_article).)
                        .ToListAsync();
            //                        .Select(x => vm_instruction(x));


            return t;
        }


        /// <summary>
        /// GET: コンテンツのベースデータをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
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
                objCollection.Add(
                    new
                    {
                        type = "instance_part",
                        id_assy = item.id_assy,
                        id_inst = item.id_inst,
                        id_part = item.id_part
                    });
            }

            foreach (var item in t.t_instructions.OrderBy(x => x.display_order))
            {
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
            }

            foreach (var item in t.t_views)
            {
                objCollection.Add(
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
                    });
            }

            return objCollection;
        }


        /// <summary>
        /// GET: インスタンスリストをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        //public JsonResult GetAssemblyObjectListOnlyInstance(int id_assy)
        public async Task<IList<object>> GetAssemblyObjectListOnlyInstance(int id_assy)
        {
            var t = await _context.t_assemblies
                        .Include(x => x.t_instance_parts)
                        .FirstOrDefaultAsync(x => x.id_assy == id_assy);

            IList<object> objCollection = new List<object>();

            foreach (var item in t.t_instance_parts)
            {
                objCollection.Add(
                    new
                    {
                        type = "instance_part",
                        id_assy = item.id_assy,
                        id_inst = item.id_inst,
                        id_part = item.id_part
                    });
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


            // 更新に失敗した場合、編集画面を再描画
            //return View(id_article);
        }

        [HttpGet]
        public async Task<IActionResult> GetPartObjectFile(long id_part)
        {
            t_part t_part = await _context.t_parts.FindAsync(id_part);

            return File(t_part.file_data, t_part.type_data, t_part.part_number);
        }
        private static vm_instruction vm_instruction(t_instruction todoItem) =>
            new vm_instruction
            {
                id_article = todoItem.id_article,
                id_instruct = todoItem.id_instruct,
                id_view = todoItem.id_view,
                title = todoItem.title,
                short_description = todoItem.short_description,
                memo = todoItem.memo,
                display_order = todoItem.display_order
            };
    }

}
