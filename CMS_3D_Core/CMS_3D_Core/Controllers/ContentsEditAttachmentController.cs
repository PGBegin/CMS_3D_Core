﻿using Microsoft.AspNetCore.Http;
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

    /*
    [Authorize]
    public class ContentsEditAttachmentController : ControllerBase
    {
        private readonly db_data_coreContext _context;

        public ContentsEditAttachmentController(db_data_coreContext context)
        {
            _context = context;
        }

        ///ContensEditFileApi/ExistPartNumber?part_number=xxxxxx
        /// <summary>
        /// 
        /// </summary>
        /// <param name="part_number"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<bool> ExistPartNumber(string part_number)
        {
            long num = await _context.t_parts
                            .Where(t => t.part_number == part_number)
                            .CountAsync();
            if (num > 0)
            {
                return true;
            }
            return false;
        }

    }
    */

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


            try
            {
                t_attachment t_attachment = new t_attachment();


                t_attachment.name = name;
                t_attachment.file_data = GetByteArrayFromStream(formFile.OpenReadStream());
                t_attachment.type_data = formFile.ContentType;
                t_attachment.file_name = formFile.FileName;
                t_attachment.file_length = formFile.Length;
                t_attachment.format_data = format_data;

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
                //TempData["ResultMsg"] = e.Message.ToString();
                TempData["ResultMsg"] = "New File Attach Failed";
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }
        /*
        [HttpGet]
        public ActionResult AttachFile()
        {
            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="part_number"></param>
        /// <param name="version"></param>
        /// <param name="format_data"></param>
        /// <param name="itemlink"></param>
        /// <param name="license"></param>
        /// <param name="memo"></param>
        /// <param name="formFile"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult AttachFile(string part_number, int version, string format_data, string itemlink, string license, string memo, [FromForm] IFormFile formFile)
        {
            var parameter_id_part = new SqlParameter
            {
                ParameterName = "id_part",
                SqlDbType = System.Data.SqlDbType.BigInt,
                //Value = id_part,
                Direction = System.Data.ParameterDirection.Output
            };

            var parameter_part_number = new SqlParameter
            {
                ParameterName = "part_number",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = part_number,
            };

            var parameter_version = new SqlParameter
            {
                ParameterName = "version",
                SqlDbType = System.Data.SqlDbType.Int,
                Value = version,
            };

            var parameter_file_data = new SqlParameter
            {
                ParameterName = "file_data",
                SqlDbType = System.Data.SqlDbType.VarBinary,
            };

            var parameter_type_data = new SqlParameter
            {
                ParameterName = "type_data",
                SqlDbType = System.Data.SqlDbType.NVarChar,
            };

            var parameter_format_data = new SqlParameter
            {
                ParameterName = "format_data",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = format_data,
            };

            var parameter_file_name = new SqlParameter
            {
                ParameterName = "file_name",
                SqlDbType = System.Data.SqlDbType.NVarChar,
            };

            var parameter_file_length = new SqlParameter
            {
                ParameterName = "file_length",
                SqlDbType = System.Data.SqlDbType.BigInt,
            };


            var parameter_itemlink = new SqlParameter
            {
                ParameterName = "itemlink",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = itemlink,
            };

            var parameter_license = new SqlParameter
            {
                ParameterName = "license",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = license,
            };

            var parameter_memo = new SqlParameter
            {
                ParameterName = "memo",
                SqlDbType = System.Data.SqlDbType.NVarChar,
                Value = memo,
            };
            

            parameter_file_data.Value = formFile.OpenReadStream();
            parameter_type_data.Value = formFile.ContentType;
            parameter_file_name.Value = formFile.FileName;
            parameter_file_length.Value = formFile.Length;


            try
            {
                _context.Database
                    .ExecuteSqlRaw("EXEC [dbo].[attachmentfile_add] @part_number,@version,@file_data,@type_data,@format_data,@file_name,@file_length,@itemlink,@license,@memo,@id_part OUTPUT"
                    //, parameter_id_part
                    , parameter_part_number
                    , parameter_version
                    , parameter_file_data
                    , parameter_type_data
                    , parameter_format_data
                    , parameter_file_name
                    , parameter_file_length
                    , parameter_itemlink
                    , parameter_license
                    , parameter_memo
                    , parameter_id_part);

                TempData["ResultMsg"] = "New File Attach Success";
                return RedirectToAction(nameof(Details), new { id = parameter_id_part.Value });

            }

            

            catch (Exception e)
            {
                //TempData["ResultMsg"] = e.Message.ToString();
                TempData["ResultMsg"] = "New File Attach Failed";
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }
        
        */
        // GET: ContentsEditFile/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_part = await _context.t_parts
                .FirstOrDefaultAsync(m => m.id_part == id);
            if (t_part == null)
            {
                return NotFound();
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View(t_part);
        }



        // GET: ContentsEditFile/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_part = await _context.t_parts.FindAsync(id);
            if (t_part == null)
            {
                return NotFound();
            }
            return View(t_part);
        }

        // POST: ContentsEditFile/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("id_part,part_number,version,type_data,format_data,file_name,file_length,itemlink,license,memo")] t_part t_part)
        {
            if (id != t_part.id_part)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_parts.FindAsync(t_part.id_part);
                    target.part_number = t_part.part_number;
                    target.version = t_part.version;
                    target.type_data = t_part.type_data;
                    target.format_data = t_part.format_data;
                    target.file_name = t_part.file_name;
                    target.file_length = t_part.file_length;
                    target.itemlink = t_part.itemlink;
                    target.license = t_part.license;
                    target.memo = t_part.memo;

                    //_context.Update(t_part);
                    await _context.SaveChangesAsync();
                    TempData["ResultMsg"] = "Edit Success";
                    return RedirectToAction(nameof(Details), new { id = t_part.id_part });
                }
                catch (DbUpdateConcurrencyException)
                {
                    TempData["ResultMsg"] = "Edit Failed";

                    if (!t_partExists(t_part.id_part))
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
            return View(t_part);
        }
        // GET: ContentsEditFile/Delete/5
        public ActionResult Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_part = _context.t_parts.Find(id);

            if (t_part == null)
            {
                return NotFound();
            }

            return View(t_part);
        }

        // POST: ContentsEditFile/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(long id)
        {
            var t_part = _context.t_parts.Find(id);
            _context.t_parts.Remove(t_part);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        private bool t_partExists(long id)
        {
            return _context.t_parts.Any(e => e.id_part == id);
        }
    }
}
