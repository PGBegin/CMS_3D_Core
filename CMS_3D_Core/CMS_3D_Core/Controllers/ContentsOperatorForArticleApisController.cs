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
