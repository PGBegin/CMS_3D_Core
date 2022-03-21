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
    //[Route("api/[controller]")]
    //[ApiController]
    [Authorize]
    public class ContentsModelFileApiController : ControllerBase
    {
        private readonly db_data_coreContext _context;

        public ContentsModelFileApiController(db_data_coreContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Return a list of parts in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<IList<object>> Index()
        {

            var t = await _context.t_parts
                    .Select(x => new t_part()
                    {
                        id_part = x.id_part,
                        part_number = x.part_number,
                        version = x.version,
                        type_data = x.type_data,
                        file_name = x.file_name,
                        format_data = x.format_data,
                        file_length = x.file_length,
                        license = x.license,
                        author = x.author,
                        itemlink = x.itemlink,
                        memo = x.memo,
                        create_datetime = x.create_datetime,
                        latest_update_datetime = x.latest_update_datetime,
                    })
                    .ToListAsync();


            IList<object> objCollection = new List<object>();

            foreach (var item in t)
            {
                objCollection.Add(object_from_t_part(item));
            }

            return objCollection;
        }


        public static byte[] GetByteArrayFromStream(Stream sm)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                sm.CopyTo(ms);
                return ms.ToArray();
            }
        }


        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> Create(string part_number, int version, string format_data, string itemlink, string license, string author, string memo, [FromForm] IFormFile formFile)
        {


            string updatemode = "Create";
            string updateresult = "";
            string updateresult_msg = "";

            IList<object> objCollection = new List<object>();

            if (formFile == null)
            {
                updateresult = "Failed";
                updateresult_msg = "New Model File Attach Failed";

                objCollection.Add(
                    new
                    {
                        updatemode = updatemode,
                        updateresult = updateresult,
                        updateresult_msg = updateresult_msg,
                    });
                return objCollection;
            }

            try
            {


                t_part t_part = new t_part();


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
                    updateresult = "Failed";
                    updateresult_msg = "Update Failed";

                    objCollection.Add(
                        new
                        {
                            updatemode = updatemode,
                            updateresult = updateresult,
                            updateresult_msg = updateresult_msg,
                        });
                    return objCollection;
                }


                await _context.AddAsync(t_part);
                await _context.SaveChangesAsync();


                updateresult = "Success";
                updateresult_msg = "Update Success ID : " + t_part.id_part;

            }
            catch (Exception e)
            {
                updateresult = "Failed";
                updateresult_msg = "Create Failed";
#if DEBUG
#endif
            }



            objCollection.Add(
                new
                {
                    updatemode = updatemode,
                    updateresult = updateresult,
                    updateresult_msg = updateresult_msg,
                });

            return objCollection;
        }


        /// <summary>
        /// Return a list of articles in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<object> Details(long id)
        {

            //var t = await _context.t_parts.Where(x => x.id_part == id).FirstOrDefaultAsync();

            var t = await _context.t_parts
                    .Select(x => new t_part()
                    {
                        id_part = x.id_part,
                        part_number = x.part_number,
                        version = x.version,
                        type_data = x.type_data,
                        file_name = x.file_name,
                        format_data = x.format_data,
                        file_length = x.file_length,
                        license = x.license,
                        author = x.author,
                        itemlink = x.itemlink,
                        memo = x.memo,
                        create_datetime = x.create_datetime,
                        latest_update_datetime = x.latest_update_datetime,
                    })
                    .Where(x => x.id_part == id)
                    .FirstOrDefaultAsync();

            object objCollection = object_from_t_part(t);

            return objCollection;
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IList<object>> Edit([FromBody] t_part t_part)
        {
            string updatemode = "Update";
            string updateresult = "";
            string updateresult_msg = "";

            try
            {
                var target = await _context.t_parts.FindAsync(t_part.id_part);
                target.part_number = t_part.part_number;
                target.version = t_part.version;
                target.type_data = t_part.type_data;
                target.format_data = t_part.format_data;
                target.file_name = t_part.file_name;
                target.itemlink = t_part.itemlink;
                target.license = t_part.license;
                target.author = t_part.author;
                target.memo = t_part.memo;


                target.latest_update_user = User.Identity.Name;
                target.latest_update_datetime = DateTime.Now;


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
        public async Task<IList<object>> Delete([FromBody] t_part t_part)
        {

            string updatemode = "Delete";
            string updateresult = "";
            string updateresult_msg = "";


            try
            {
                _context.t_parts.Remove(t_part);
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
        /// object_from_t_part
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        private static object object_from_t_part(t_part item) =>
            new
            {
                type = "part",                
                id_part = item.id_part,
                part_number = item.part_number,
                version = item.version,
                type_data = item.type_data,
                format_data = item.format_data,
                file_name = item.file_name,
                file_length = item.file_length,
                itemlink = item.itemlink,
                license = item.license,
                author = item.author,
                memo = item.memo,
                create_datetime = item.create_datetime,
                latest_update_datetime = item.latest_update_datetime,
            };
    }
}