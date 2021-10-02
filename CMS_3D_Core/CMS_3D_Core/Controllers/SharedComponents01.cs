using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;
using CMS_3D_Core.Models.EDM;




namespace CMS_3D_Core.Controllers
{
    /// <summary>
    /// t_articlesの一覧を表示する(トップページ用)
    /// </summary>
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

            return View("_ContentsList", t);
        }
    }

    /// <summary>
    /// t_assembliesの一覧を表示する
    /// </summary>
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
                                .ToListAsync();

            return View("_AssyList", t);
        }
    }

    /// <summary>
    /// t_viewsの中身(視点一覧)を表示する(編集用)
    /// </summary>
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


    /// <summary>
    /// t_articlesの中身を表示する(編集画面用)
    /// </summary>
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

            return View("_EditArticle", t_article);
        }
    }


    /// <summary>
    /// Edit View
    /// </summary>
    public class EditProductViewViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public EditProductViewViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {

            //var t_article = await _context.t_articles.FindAsync(id_article);


            var t = (await _context.t_instructions.Where(m => m.id_article == id_article).OrderBy(m => m.display_order).FirstOrDefaultAsync()) ?? new t_instruction() { id_view = 0 };
            var t2 = await _context.t_views.Where(m => m.id_article == id_article & m.id_view == t.id_view).FirstOrDefaultAsync();

            return View("_EditProductView", t2);
        }
    }

    /// <summary>
    /// Edit Instruction
    /// </summary>
    public class EditProductInstructionViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public EditProductInstructionViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {

            //var t_article = await _context.t_articles.FindAsync(id_article);

            var t = await _context.t_instructions.Where(m => m.id_article == id_article).OrderBy(m => m.display_order).FirstOrDefaultAsync();

            return View("_EditProductInstruction", t);
            //return View("_EditProductInstruction", t_article);
        }
    }
    /// <summary>
    /// Google Analytics情報を表示する
    /// </summary>
    public class GoogleAnalyticsSettingsViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public GoogleAnalyticsSettingsViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            var t = await _context.t_website_settings
                                .Where(x => x.title == "GoogleAnalyticsSettings")
                                .FirstOrDefaultAsync();

            return View("_GoogleAnalyticsSettings", t);
        }
    }

    /// <summary>
    /// Google AdSense Advertisementを表示する
    /// </summary>
    public class GoogleAdSenseAdvertisementViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public GoogleAdSenseAdvertisementViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            var t = await _context.t_website_settings
                                .Where(x => x.title == "GoogleAdSenseAdvertisement")
                                .FirstOrDefaultAsync();

            return View("_GoogleAdSenseAdvertisement", t);
        }
    }

    /// <summary>
    /// Google Analytics情報を表示する
    /// </summary>
    public class PrivacyPolicyViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public PrivacyPolicyViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {

            var t = await _context.t_website_settings
                                .Where(x => x.title == "PrivacyPolicy")
                                .FirstOrDefaultAsync();

            return View("_PrivacyPolicy", t);
        }
    }

}
