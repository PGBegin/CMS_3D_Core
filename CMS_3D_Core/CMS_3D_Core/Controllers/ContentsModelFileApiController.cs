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
        public async Task<IList<object>> GetIndex()
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



        /// <summary>
        /// Return a list of articles in JSON
        /// </summary>
        /// <returns></returns>
        [Authorize]
        [HttpGet]
        public async Task<object> GetDetails(long id)
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