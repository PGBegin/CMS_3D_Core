using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using CMS_3D_Core.Models.EDM;
using System.IO;


namespace CMS_3D_Core.Controllers
{


    [Authorize]
    public class ContensEditFileApiController : ControllerBase
    {
        private readonly db_data_coreContext _context;

        public ContensEditFileApiController(db_data_coreContext context)
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


    [Authorize]
    public class ContentsEditFileController : Controller
    {
        private readonly db_data_coreContext _context;

        public ContentsEditFileController(db_data_coreContext context)
        {
            _context = context;
        }

        public static byte[] GetByteArrayFromStream(Stream sm)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                sm.CopyTo(ms);
                return ms.ToArray();
            }
        }

        // GET: ContentsEditFile
        //public ActionResult Index()
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var t = await _context.t_parts
                                .Select(x => new t_part()
                                {
                                    id_part = x.id_part,
                                    part_number = x.part_number,
                                    version = x.version,
                                    format_data = x.format_data,
                                    file_length = x.file_length,
                                    license = x.license,
                                    author = x.author,
                                    itemlink = x.itemlink
                                })
                                .ToListAsync();
            return View(t);
        }


        [HttpGet]
        public ActionResult Create()
        {
            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(string part_number, int version, string format_data, string itemlink, string license, string author, string memo, [FromForm] IFormFile formFile)
        {

            t_part t_part = new t_part();

            if (formFile == null)
            {
                TempData["ResultMsg"] = "New File Attach Failed";
                return View(t_part);
            }

            t_part.part_number = part_number;
            t_part.file_data = GetByteArrayFromStream(formFile.OpenReadStream());
            t_part.type_data = formFile.ContentType;
            t_part.file_name = formFile.FileName;
            t_part.file_length = formFile.Length;
            t_part.format_data = format_data;


            t_part.itemlink = itemlink;
            t_part.license = license;
            t_part.author = author;
            t_part.memo = memo;



            t_part.create_user = User.Identity.Name;
            t_part.create_datetime = DateTime.Now;
            t_part.latest_update_user = User.Identity.Name;
            t_part.latest_update_datetime = DateTime.Now;

            t_part.id_part = 1 + (await _context.t_parts
                                        .Where(t => t.id_part == t.id_part)
                                        .MaxAsync(t => (long?)t.id_part) ?? 0);


            ModelState.ClearValidationState(nameof(t_part));
            if (!TryValidateModel(t_part, nameof(t_part)))
            {
                TempData["ResultMsg"] = "New File Attach Failed";
                return View(t_part);
            }


            try
            {
                await _context.AddAsync(t_part);
                await _context.SaveChangesAsync();

                TempData["ResultMsg"] = "New File Attach Success";
                return RedirectToAction(nameof(Details), new { id = t_part.id_part });

            }
            catch (Exception e)
            {
                //TempData["ResultMsg"] = e.Message.ToString();
                TempData["ResultMsg"] = "New File Attach Failed";
#if DEBUG
                TempData["ResultMsg"] = e.Message;
#endif
            }

            ViewBag.ResultMsg = TempData["ResultMsg"];
            return View();

        }
        /*
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create2(string part_number, int version, string format_data, string itemlink, string license, string memo, [FromForm] IFormFile formFile)
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


        /// <summary>
        /// show datails
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
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
        public async Task<IActionResult> Edit(long id, [Bind("id_part,part_number,version,type_data,format_data,file_name,file_length,itemlink,license,author,memo")] t_part t_part)
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
                    target.author = t_part.author;
                    target.memo = t_part.memo;

                    //_context.Update(t_part);
                    await _context.SaveChangesAsync();
                    TempData["ResultMsg"] = "Edit Success";
                    return RedirectToAction(nameof(Details),new { id = t_part.id_part });
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



 
 



