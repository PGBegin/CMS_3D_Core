using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using CMS_3D_Core.Models.EDM;

namespace CMS_3D_Core.Controllers
{

    
    [Authorize]
    public class ContentsEditAttachmentAPIController : ControllerBase
    {
        private readonly db_data_coreContext _context;

        public ContentsEditAttachmentAPIController(db_data_coreContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET: 選択されたオブジェクトファイルを返す関数
        /// </summary>
        /// <param name="id_part"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAttachmentFile(long id)
        {

            t_attachment t_attachment = await _context.t_attachments.FindAsync(id);

            return File(t_attachment.file_data, t_attachment.type_data, t_attachment.name);
        }

    }
    

    [Authorize]
    public class ContentsEditAttachmentController : Controller
    {
        private readonly db_data_coreContext _context;

        public ContentsEditAttachmentController(db_data_coreContext context)
        {
            _context = context;
        }


        // GET: ContentsEditFile
        //public ActionResult Index()
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var t = await _context.t_attachments.ToListAsync();
            return View(t);
        }


        [HttpGet]
        public ActionResult Create()
        {
            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }


        public static byte[] GetByteArrayFromStream(Stream sm)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                sm.CopyTo(ms);
                return ms.ToArray();
            }
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(string name, string format_data, string itemlink, string license, string memo, [FromForm] IFormFile formFile)
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

        [AllowAnonymous]
        public async Task<IActionResult> GetAttachmentFile(long id)
        {

            t_attachment t_attachment = await _context.t_attachments.FindAsync(id);

            return File(t_attachment.file_data, t_attachment.type_data, t_attachment.file_name);
        }
        // GET: ContentsEditFile/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_attachment = await _context.t_attachments
                .FirstOrDefaultAsync(m => m.id_file == id);
            if (t_attachment == null)
            {
                return NotFound();
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View(t_attachment);
        }



        // GET: ContentsEditFile/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_attachment = await _context.t_attachments.FindAsync(id);
            if (t_attachment == null)
            {
                return NotFound();
            }
            return View(t_attachment);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> Edit(long id, [Bind("id_file,name,format_data,file_name,itemlink,license,memo")] t_attachment t_attachment)
        public async Task<IActionResult> Edit([Bind("id_file,name,format_data,file_name,itemlink,license,memo")] t_attachment t_attachment)
        {
            /*
            if (id != t_part.id_part)
            {
                return NotFound();
            }*/

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_attachments.FindAsync(t_attachment.id_file);
                    target.name = t_attachment.name;
                    target.format_data = t_attachment.format_data;
                    target.file_name = t_attachment.file_name;
                    target.itemlink = t_attachment.itemlink;
                    target.license = t_attachment.license;
                    target.memo = t_attachment.memo;

                    //_context.Update(t_part);
                    await _context.SaveChangesAsync();
                    TempData["ResultMsg"] = "Edit Success";
                    return RedirectToAction(nameof(Details), new { id = t_attachment.id_file });
                }
                catch (DbUpdateConcurrencyException)
                {
                    TempData["ResultMsg"] = "Edit Failed";

                    if (!t_partExists(t_attachment.id_file))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                    //TempData["ResultMsg"] = e.Message.ToString();
                }
                //return RedirectToAction(nameof(Index));
            }
            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View(t_attachment);
        }


        // GET: ContentsEditFile/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_attachment = await _context.t_attachments.FindAsync(id);

            if (t_attachment == null)
            {
                return NotFound();
            }

            return View(t_attachment);
        }

        // POST: ContentsEditFile/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        //public ActionResult DeleteConfirmed(long id)
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var t_attachment = await _context.t_attachments.FindAsync(id);
            _context.t_attachments.Remove(t_attachment);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool t_partExists(long id)
        {
            return _context.t_parts.Any(e => e.id_part == id);
        }
    }
}
