using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using CMS_3D_Core.Models.EDM;



using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CMS_3D_Core.Controllers
{
 //   [Route("api/[controller]")]
 //   [ApiController]
    [Authorize]
    public class ContentsAttachmentFileController : ControllerBase
    {

        private readonly db_data_coreContext _context;

        public ContentsAttachmentFileController(db_data_coreContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Return a list of articles in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<IList<object>> GetAttachmentFileIndex()
        {

            var t = await _context.t_attachments.ToListAsync();

            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
                objCollection.Add(object_from_t_attachment(item));
            }



            return objCollection;
        }

        /*
        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> Create(string name, string format_data, string itemlink, string license, string memo, [FromForm] IFormFile formFile)
        {
            if (formFile == null)
            {
                TempData["ResultMsg"] = "New File Attach Failed";
                ViewBag.ResultMsg = TempData["ResultMsg"];
                return View();
            }

            try
            {
                t_attachment t_attachment = new t_attachment();


                t_attachment.name = name ?? System.IO.Path.GetFileNameWithoutExtension(formFile.FileName);
                t_attachment.file_data = GetByteArrayFromStream(formFile.OpenReadStream());
                t_attachment.type_data = formFile.ContentType;
                t_attachment.file_name = formFile.FileName;
                t_attachment.file_length = formFile.Length;
                t_attachment.format_data = format_data ?? System.IO.Path.GetExtension(formFile.FileName);

                t_attachment.itemlink = itemlink;
                t_attachment.license = license;
                t_attachment.memo = memo;

                t_attachment.isActive = true;


                t_attachment.create_user = User.Identity.Name;
                t_attachment.create_datetime = DateTime.Now;
                t_attachment.latest_update_user = User.Identity.Name;
                t_attachment.latest_update_datetime = DateTime.Now;


                t_attachment.id_file = 1 + (_context.t_attachments
                                            .Where(t => t.id_file == t.id_file)
                                            .Max(t => (long?)t.id_file) ?? 0);

                _context.Add(t_attachment);
                _context.SaveChanges();

                TempData["ResultMsg"] = "New File Attach Success";
                return RedirectToAction(nameof(Details), new { id = t_attachment.id_file });

            }



            catch (Exception e)
            {
                TempData["ResultMsg"] = "New File Attach Failed";
#if DEBUG
                TempData["ResultMsg"] = e.Message;
#endif
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }

        */

        /// <summary>
        /// Return a list of articles in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<object> GetAttachmentFileDetails(long id)
        {

            var t = await _context.t_attachments.Where(x => x.id_file == id).FirstOrDefaultAsync();

            object objCollection = object_from_t_attachment(t);

            return objCollection;
        }




        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAttachmentFileObject(long id)
        {

            t_attachment t_attachment = await _context.t_attachments.FindAsync(id);

            return File(t_attachment.file_data, t_attachment.type_data, t_attachment.file_name);
        }


        /// <summary>
        /// Update or Add View for Ajax
        /// </summary>
        /// <param name="_t_view"></param>
        /// <returns>Result of Api Action with Json</returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditAttachmentFileEdit([FromBody] t_attachment t_attachment)
        {



            string updatemode = "Update";
            string updateresult = "";
            string updateresult_msg = "";

            try
            {
                var target = await _context.t_attachments.FindAsync(t_attachment.id_file);
                target.name = t_attachment.name;
                target.file_name = t_attachment.file_name;
                target.format_data = t_attachment.format_data;
                target.file_name = t_attachment.file_name;
                target.itemlink = t_attachment.itemlink;
                target.license = t_attachment.license;
                target.memo = t_attachment.memo;


                target.latest_update_user = User.Identity.Name;
                target.latest_update_datetime = DateTime.Now;



                // DBに更新を反映
                await _context.SaveChangesAsync();

                updateresult = "Success";
                updateresult_msg = "Update Success";


            }
            catch (Exception e)
            {
                updateresult = "Failed";
                updateresult_msg = "Update Failed";
#if DEBUG
                updateresult_msg = e.Message;
#endif
            }



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


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> EditAttachmentFileDelete([FromBody] t_attachment t_attachment)
        {

            string updatemode = "Delete";
            string updateresult = "";
            string updateresult_msg = "";


            try
            {
                _context.t_attachments.Remove(t_attachment);
                await _context.SaveChangesAsync();

                updateresult = "Success";
                updateresult_msg = "Delete Success";


            }
            catch (Exception e)
            {
                updateresult = "Failed";
                updateresult_msg = "Delete Failed";
#if DEBUG
                updateresult_msg = e.Message;
#endif
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
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_attachment(t_attachment item) =>
            new
            {
                type = "attachment",
                id_file = item.id_file,
                isActive = item.isActive,
                file_name = item.file_name,
                name = item.name,
                format_data = item.format_data,
                type_data = item.type_data,
                file_length = item.file_length,
                itemlink = item.itemlink,
                license = item.license,
                memo = item.memo,
                create_datetime = item.create_datetime,
                latest_update_datetime = item.latest_update_datetime,
                target_article_id = item.target_article_id,
            };
    }
}