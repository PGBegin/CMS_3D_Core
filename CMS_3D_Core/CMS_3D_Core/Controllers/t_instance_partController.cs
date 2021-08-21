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
    public class t_instance_partController : Controller
    {
        private readonly db_data_coreContext _context;

        public t_instance_partController(db_data_coreContext context)
        {
            _context = context;
        }

        // GET: t_instance_part
        public async Task<IActionResult> Index()
        {
            var db_data_coreContext = _context.t_instance_parts.Include(t => t.id_assyNavigation).Include(t => t.id_partNavigation);
            return View(await db_data_coreContext.ToListAsync());
        }

        // GET: t_instance_part/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_instance_part = await _context.t_instance_parts
                .Include(t => t.id_assyNavigation)
                .Include(t => t.id_partNavigation)
                .FirstOrDefaultAsync(m => m.id_assy == id);
            if (t_instance_part == null)
            {
                return NotFound();
            }

            return View(t_instance_part);
        }

        // GET: t_instance_part/Create
        public IActionResult Create()
        {
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy");
            ViewData["id_part"] = new SelectList(_context.t_parts, "id_part", "part_number");
            return View();
        }

        // POST: t_instance_part/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("id_assy,id_inst,id_part")] t_instance_part t_instance_part)
        {
            if (ModelState.IsValid)
            {
                _context.Add(t_instance_part);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy", t_instance_part.id_assy);
            ViewData["id_part"] = new SelectList(_context.t_parts, "id_part", "part_number", t_instance_part.id_part);
            return View(t_instance_part);
        }

        // GET: t_instance_part/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_instance_part = await _context.t_instance_parts.FindAsync(id);
            if (t_instance_part == null)
            {
                return NotFound();
            }
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy", t_instance_part.id_assy);
            ViewData["id_part"] = new SelectList(_context.t_parts, "id_part", "part_number", t_instance_part.id_part);
            return View(t_instance_part);
        }

        // POST: t_instance_part/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("id_assy,id_inst,id_part")] t_instance_part t_instance_part)
        {
            if (id != t_instance_part.id_assy)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(t_instance_part);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!t_instance_partExists(t_instance_part.id_assy))
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
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "id_assy", t_instance_part.id_assy);
            ViewData["id_part"] = new SelectList(_context.t_parts, "id_part", "part_number", t_instance_part.id_part);
            return View(t_instance_part);
        }

        // GET: t_instance_part/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_instance_part = await _context.t_instance_parts
                .Include(t => t.id_assyNavigation)
                .Include(t => t.id_partNavigation)
                .FirstOrDefaultAsync(m => m.id_assy == id);
            if (t_instance_part == null)
            {
                return NotFound();
            }

            return View(t_instance_part);
        }

        // POST: t_instance_part/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var t_instance_part = await _context.t_instance_parts.FindAsync(id);
            _context.t_instance_parts.Remove(t_instance_part);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool t_instance_partExists(long id)
        {
            return _context.t_instance_parts.Any(e => e.id_assy == id);
        }
    }
}
