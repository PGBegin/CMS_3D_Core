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


namespace CMS_3D_Core.Controllers
{
    public class ContentsOperatorApisController : Controller
    {
        //private db_data_coreContext db = new db_data_coreContext();

        private readonly db_data_coreContext _context;

        public ContentsOperatorApisController(db_data_coreContext context)
        {
            _context = context;
        }


        [HttpGet]
        public JsonResult GetArticleObject(long id_article)
        {
            var t = _context.t_articles
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts)
                        .FirstOrDefault(x => x.id_article == id_article);

            object objCollection = new
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

            return Json(objCollection);
        }

        /// <summary>
        /// GET: コンテンツのベースデータをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public JsonResult GetAssemblyObjectList(int id_article)
        {
            var t = _context.t_articles
                        .Include(x => x.t_instructions)
                        .Include(x => x.t_views)
                        .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts)
                        .FirstOrDefault(x => x.id_article == id_article);

            IList<object> objCollection = new List<object>();

            foreach (var item in t.id_assyNavigation.t_instance_parts)
            {
                objCollection.Add(
                    new { 
                        type = "instance_part",
                        id_assy = item.id_assy, 
                        id_inst = item.id_inst, 
                        id_part = item.id_part
                    });
            }

            foreach (var item in t.t_instructions.OrderBy(x => x.display_order))
            {
                objCollection.Add(
                    new { 
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
                    new { 
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

            return Json(objCollection);
        }


        /// <summary>
        /// GET: インスタンスリストをJsonで返す
        /// </summary>
        /// <param name="id_assy">アセンブリID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public JsonResult GetAssemblyObjectListOnlyInstance(int id_assy)
        {
            var t = _context.t_assemblies
                        .Include(x => x.t_instance_parts)
                        .FirstOrDefault(x => x.id_assy == id_assy);

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



            return Json(objCollection);
        }

        /// <summary>
        /// GET: Rerutn Annotation Data with Json Formats
        /// </summary>
        /// <param name="id_article">ArticleID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public JsonResult GetAnnotationObjectList(long id_article)
        {
            var t = _context.t_annotations
                        .Where(x => x.id_article == id_article)
                        .ToList();

            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
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
                    });
            }



            return Json(objCollection);
        }


        /// <summary>
        /// GET: Rerutn Annotation Data with Json Formats
        /// </summary>
        /// <param name="id_article">ArticleID</param>
        /// <returns>ファイルのJsonデータ</returns>
        [HttpGet]
        public JsonResult GetAnnotationDisplayObjectList(long id_article)
        {
            var t = _context.t_annotation_displays
                        .Where(x => x.id_article == id_article)
                        .ToList();

            IList<object> objCollection = new List<object>();

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
        }
        /*
        /// <summary>
        /// GET: 選択されたオブジェクトファイルを返す関数
        /// </summary>
        /// <param name="id_part"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult GetPartObjectFile2(long id_part)
        {
            t_part t_part = _context.t_parts.Find(id_part);

            return File(t_part.file_data, t_part.type_data, t_part.part_number);
        }
        */

        /// <summary>
        /// GET: 選択されたオブジェクトファイルを返す関数
        /// </summary>
        /// <param name="id_part"></param>
        /// <returns></returns>
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
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
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

    public partial class vm_instance_part
    {
        public long id_assy { get; set; }
        public long id_inst { get; set; }
        public long id_part { get; set; }
    }



    public class ContentsOperatorApis2Controller : ControllerBase
    {
        //private db_data_coreContext db = new db_data_coreContext();

        private readonly db_data_coreContext _context;

        public ContentsOperatorApis2Controller(db_data_coreContext context)
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
            /*
            var z = await _context.t_articles
                        .Include(t => t.id_assyNavigation).ThenInclude(t => t.t_instance_parts)
                        .Where(t => t.id_article == id_article)
                        .Select(t => vm_instance_part(t));
            */

            var t = await _context.t_instance_parts
                        //.Where(x => x.id_assyNavigation.t_articles.FirstOrDefault().id_article == id_article)
//                        .Where(x => x.id_assyNavigation.t_articles.Where(m => m.id_article == id_article).)
                        .ToListAsync();
//                        .Select(x => vm_instruction(x));
            

            return t;
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
