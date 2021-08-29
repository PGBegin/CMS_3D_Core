using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CMS_3D_Core.Models.EDM;
using Microsoft.EntityFrameworkCore;



using Microsoft.AspNetCore.Mvc.Rendering;

namespace CMS_3D_Core.Controllers
{
    public class ContentsListViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public ContentsListViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            var t = await _context.t_articles
                                .Include(x => x.statusNavigation)
                                .Where(x => x.statusNavigation.is_approved == true)
                                .ToListAsync();

            return View("_ContentsListView", t);
        }
    }

    public class AssyListViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public AssyListViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            var t = await _context.t_assemblies
                                .Include(x => x.t_articles)
                                //.Where(x => x.statusNavigation.is_approved == true)
                                .ToListAsync();

            return View("_AssyList", t);
        }
    }
    public class ViewListViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public ViewListViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {

            var t = await _context.t_views
                                .Include(x => x.id_articleNavigation)
                                .Include(x => x.t_instructions)
                                .Where(x => x.id_article == id_article)
                                .ToListAsync();

            return View("_ViewList", t);
        }
    }


    public class EditArticleViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public EditArticleViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {

            var t_article = await _context.t_articles.FindAsync(id_article);
            ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name", t_article.id_assy);
            ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name", t_article.status);

            //var t = await _context.t_articles
                                //.Include(x => x.id_articleNavigation)
                                //.Include(x => x.t_instructions)
                               // .Where(x => x.id_article == id_article)
                               // .ToListAsync();

            return View("_EditArticle", t_article);
        }
    }
}
