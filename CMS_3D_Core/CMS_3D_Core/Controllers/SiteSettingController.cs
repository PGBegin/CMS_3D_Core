using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS_3D_Core.Models.EDM;

namespace CMS_3D_Core.Controllers
{
    public class SiteSettingController : Controller
    {
        private readonly db_data_coreContext _context;

        public SiteSettingController(db_data_coreContext context)
        {
            _context = context;
        }

        // GET: SiteSetting
        public async Task<IActionResult> Index()
        {
            return View(await _context.t_website_settings.ToListAsync());
        }

        // GET: SiteSetting/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_website_setting = await _context.t_website_settings
                .FirstOrDefaultAsync(m => m.title == id);
            if (t_website_setting == null)
            {
                return NotFound();
            }

            return View(t_website_setting);
        }

        // GET: SiteSetting/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: SiteSetting/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("title,data,memo")] t_website_setting t_website_setting)
        {
            if (ModelState.IsValid)
            {
                _context.Add(t_website_setting);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(t_website_setting);
        }

        // GET: SiteSetting/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_website_setting = await _context.t_website_settings.FindAsync(id);
            if (t_website_setting == null)
            {
                return NotFound();
            }
            return View(t_website_setting);
        }

        // POST: SiteSetting/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("title,data,memo")] t_website_setting t_website_setting)
        {
            if (id != t_website_setting.title)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(t_website_setting);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!t_website_settingExists(t_website_setting.title))
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
            return View(t_website_setting);
        }

        // GET: SiteSetting/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var t_website_setting = await _context.t_website_settings
                .FirstOrDefaultAsync(m => m.title == id);
            if (t_website_setting == null)
            {
                return NotFound();
            }

            return View(t_website_setting);
        }

        // POST: SiteSetting/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var t_website_setting = await _context.t_website_settings.FindAsync(id);
            _context.t_website_settings.Remove(t_website_setting);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool t_website_settingExists(string id)
        {
            return _context.t_website_settings.Any(e => e.title == id);
        }
    }
}
