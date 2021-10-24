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

            if (t_article != null)
            {
                ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name", t_article.id_assy);
                ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name", t_article.status);
            } else
            {
                t_article = new t_article() { 
                                                directional_light_color=1,
                                                directional_light_intensity=1,
                                                directional_light_px=30, 
                                                directional_light_py=30,
                                                directional_light_pz=30,
                                                ambient_light_color=1,
                                                ambient_light_intensity=1,
                                                gammaOutput=true
                                                };

                ViewData["id_assy"] = new SelectList(_context.t_assemblies, "id_assy", "assy_name");
                ViewData["status"] = new SelectList(_context.m_status_articles, "id", "name");
            }

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

            var t = await _context.t_instructions.Where(m => m.id_article == id_article).OrderBy(m => m.display_order).FirstOrDefaultAsync();

            return View("_EditProductInstruction", t);
        }
    }

    /// <summary>
    /// Edit Instruction
    /// </summary>
    public class EditProductAnnotationViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public EditProductAnnotationViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {

            var t = await _context.t_annotations.Where(m => m.id_article == id_article).OrderBy(m => m.id_annotation).FirstOrDefaultAsync();

            return View("_EditProductAnnotation", t);
        }
    }

    /// <summary>
    /// Edit Instruction
    /// </summary>
    public class DetatiMaterialViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public DetatiMaterialViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {


            var t = await _context.t_articles
                                .Include(x => x.id_assyNavigation).ThenInclude(x => x.t_instance_parts).ThenInclude(x => x.id_partNavigation)
                                .Where(m => m.id_article == id_article).FirstOrDefaultAsync();

            return View("_DetatiMaterial", t);
        }
    }

    /// <summary>
    /// Show Thmbnail Capture and Upload view
    /// </summary>
    public class EditThumbnailViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public EditThumbnailViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {

            var t = await _context.t_articles.FindAsync(id_article);

            //var t = await _context.t_instructions.Where(m => m.id_article == id_article).OrderBy(m => m.display_order).FirstOrDefaultAsync();

            return View("_EditThumbnail", t);
        }
    }



    /// <summary>
    /// Show AnnotationDisplay view
    /// </summary>
    public class EditProductAnnotationDisplayViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public EditProductAnnotationDisplayViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long id_article)
        {


            //var t = (await _context.t_instructions.Where(m => m.id_article == id_article).OrderBy(m => m.display_order).FirstOrDefaultAsync()) ?? new t_instruction() { id_view = 0 };


            //if (id_article != 0) { 
            var instfirst = (await _context.t_instructions.Where(m => m.id_article == id_article).FirstOrDefaultAsync()) ?? new t_instruction() { id_instruct = 0 };



            var t = await _context.t_annotation_displays
                                  .Include(m => m.id_a)
                                  .Where(m => m.id_article == id_article & m.id_instruct == instfirst.id_instruct)
                                  .ToListAsync();

            return View("_EditProductAnnotationDisplay", t);
            
            
            /*
            }
            else
            {
                var t = await _context.t_annotation_displays
                      .Include(m => m.id_a)
                      .Where(m => m.id_article == id_article)
                      .ToListAsync();
                return View("_EditProductAnnotationDisplay", t);
            }*/
        }
    }



    /// <summary>
    /// Show Thmbnail Capture and Upload view
    /// </summary>
    public class InstanceListViewComponent : ViewComponent
    {
        private readonly db_data_coreContext _context;

        public InstanceListViewComponent(db_data_coreContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(long? id_assy)
        {

            var t = await _context.t_instance_parts
                                            .Include(t => t.id_assyNavigation)
                                            .Include(t => t.id_partNavigation)
                                            .Where(m => m.id_assy == id_assy)
                                            .ToListAsync();


            return View("_InstanceList", t);
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
