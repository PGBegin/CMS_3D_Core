using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS_3D_Core.Models.EDM;
using Microsoft.AspNetCore.Authorization;

namespace CMS_3D_Core.Controllers
{
    [Authorize]
    public class t_articleController : Controller
    {
        private readonly db_data_coreContext _context;

        public t_articleController(db_data_coreContext context)
        {
            _context = context;
        }

        // GET: t_article
        //public async Task<IActionResult> Index()
        //{
        //    var db_data_coreContext = _context.t_articles.Include(t => t.id_assyNavigation).Include(t => t.statusNavigation);
        //    return View(await db_data_coreContext.ToListAsync());
        //}

        // GET: t_article/Details/5
        public async Task<IActionResult> Details(long? id_article)
        {
            if (id_article == null)
            {
                return NotFound();
            }

            var t_article = await _context.t_articles
                .Include(t => t.id_assyNavigation)
                .Include(t => t.statusNavigation)
                .FirstOrDefaultAsync(m => m.id_article == id_article);
            if (t_article == null)
            {
                return NotFound();
            }

            return View(t_article);
        }

        // GET: t_article/Create
        public IActionResult Create()
        {

            t_assembly z = new t_assembly();
            z.id_assy = 6;
            z.assy_name = "xxnone";

            IEnumerable<t_assembly> x = _context.t_assemblies;
            x.Append(z);


//            ViewData["id_assy"] = new SelectList(x, "id_assy", "assy_name");
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name");
            //ViewData["status"] = new SelectList(x, "id", "name",null);
            ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name");
            return View();
        }

        // POST: t_article/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("id_article,id_assy,title,short_description,long_description,status")] t_article t_article)
        {
            if (ModelState.IsValid)
            {
                _context.Add(t_article);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Details),new { id_article = t_article.id_article} );
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name", t_article.id_assy);
            ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name", t_article.status);
            return View(t_article);
        }

        // GET: t_article/Edit/5
        public async Task<IActionResult> Edit(long? id_article)
        {
            if (id_article == null)
            {
                return NotFound();
            }

            var t_article = await _context.t_articles.FindAsync(id_article);
            if (t_article == null)
            {
                return NotFound();
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name", t_article.id_assy);
            ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name", t_article.status);
            return View(t_article);
        }

        // POST: t_article/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit([Bind("id_article,id_assy,title,short_description,long_description,status,directional_light_color,directional_light_intensity,directional_light_px,directional_light_py,directional_light_pz,ambient_light_color,ambient_light_intensity,gammaOutput")] t_article t_article)
        {

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(t_article);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!t_articleExists(t_article.id_article))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(ContentsEditController.EditProductInstruction), new { controller = "ContentsEdit", id_article = t_article.id_article });
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name", t_article.id_assy);
            ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name", t_article.status);
            return View(t_article);
        }

        // GET: t_article/Delete/5
        public async Task<IActionResult> Delete(long? id_article)
        {
            if (id_article == null)
            {
                return NotFound();
            }

            var t_article = await _context.t_articles
                .Include(t => t.id_assyNavigation)
                .Include(t => t.statusNavigation)
                .FirstOrDefaultAsync(m => m.id_article == id_article);
            if (t_article == null)
            {
                return NotFound();
            }

            return View(t_article);
        }

        // POST: t_article/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id_article)
        {
            var t_article = await _context.t_articles.FindAsync(id_article);
            _context.t_articles.Remove(t_article);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index), new { Controller = "ContentsEdit" });
        }

        private bool t_articleExists(long id_article)
        {
            return _context.t_articles.Any(e => e.id_article == id_article);
        }
    }
}
