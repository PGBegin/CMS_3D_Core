using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS_3D_Core.Models.EDM;

namespace CMS_3D_Core.Controllers
{
    [Authorize]
    public class t_viewController : Controller
    {
        private readonly db_data_coreContext _context;

        public t_viewController(db_data_coreContext context)
        {
            _context = context;
        }

        // GET: t_view
        public async Task<IActionResult> Index(long id_assy)
        {
            var db_data_coreContext = _context.t_views
                                            .Include(t => t.id_assyNavigation)
                                            .Where(t => t.id_assy == id_assy);

            return View(await db_data_coreContext.ToListAsync());
        }
        /*
        // GET: t_view/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_view = await _context.t_views
                .Include(t => t.id_assyNavigation)
                .FirstOrDefaultAsync(m => m.id_assy == id);
            if (t_view == null)
            {
                return NotFound();
            }

            return View(t_view);
        }

        // GET: t_view/Create
        public IActionResult Create()
        {
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy");
            return View();
        }

        // POST: t_view/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("id_assy,id_view,title,cam_pos_x,cam_pos_y,cam_pos_z,cam_lookat_x,cam_lookat_y,cam_lookat_z,cam_quat_x,cam_quat_y,cam_quat_z,cam_quat_w,obt_target_x,obt_target_y,obt_target_z")] t_view t_view)
        {
            if (ModelState.IsValid)
            {
                _context.Add(t_view);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy", t_view.id_assy);
            return View(t_view);
        }

        // GET: t_view/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_view = await _context.t_views.FindAsync(id);
            if (t_view == null)
            {
                return NotFound();
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy", t_view.id_assy);
            return View(t_view);
        }

        // POST: t_view/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("id_assy,id_view,title,cam_pos_x,cam_pos_y,cam_pos_z,cam_lookat_x,cam_lookat_y,cam_lookat_z,cam_quat_x,cam_quat_y,cam_quat_z,cam_quat_w,obt_target_x,obt_target_y,obt_target_z")] t_view t_view)
        {
            if (id != t_view.id_assy)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(t_view);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!t_viewExists(t_view.id_assy))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy", t_view.id_assy);
            return View(t_view);
        }
        */
        // GET: t_view/Delete/5
        public async Task<IActionResult> Delete(long? id_assy, int? id_view )
        {
            if (id_assy == null | id_view == null)
            {
                return NotFound();
            }

            var t_view = await _context.t_views
                .Include(t => t.id_assyNavigation)
                .FirstOrDefaultAsync(m => m.id_assy == id_assy & m.id_view == id_view);
            if (t_view == null)
            {
                return NotFound();
            }

            return View(t_view);
        }

        // POST: t_view/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id_assy, int id_view)
        {
            var t_view = await _context.t_views.FindAsync(id_assy ,id_view);
            _context.t_views.Remove(t_view);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index),new { id_assy = id_assy });
        }

        private bool t_viewExists(long id)
        {
            return _context.t_views.Any(e => e.id_assy == id);
        }
    }
}
