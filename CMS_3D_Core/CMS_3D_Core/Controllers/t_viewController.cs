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
        public async Task<IActionResult> Index(long id_article)
        {
            var db_data_coreContext = _context.t_views
                                            .Include(t => t.id_articleNavigation)
                                            .Where(t => t.id_article == id_article);

            return View(await db_data_coreContext.ToListAsync());
        }

        
        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProductView(
                                                        long id_article, int id_view, string title,
                                                        float cam_pos_x,float cam_pos_y,float cam_pos_z,
                                                        float cam_lookat_x,float cam_lookat_y,float cam_lookat_z,
                                                        float cam_quat_x,float cam_quat_y,float cam_quat_z,float cam_quat_w,
                                                        float obt_target_x,float obt_target_y,float obt_target_z
            )
        {

            
            //if (id_article == null | id_view == null)
            //{
            //    return NotFound();
            //}
            

            if (ModelState.IsValid)
            {
                try
                {
                    var target = await _context.t_views.FindAsync(id_article, id_view);
                    if (target == null)
                    {
                        //if target does not find, update new item

                        t_view t_view = new t_view();
                        // Key data
                        t_view.id_article = id_article;
                        t_view.id_view = id_view;
                        t_view.title = title;
                        //Camera Position
                        t_view.cam_pos_x = cam_pos_x;
                        t_view.cam_pos_y = cam_pos_y;
                        t_view.cam_pos_z = cam_pos_z;

                        //Lookat
                        t_view.cam_lookat_x = cam_lookat_x;
                        t_view.cam_lookat_y = cam_lookat_y;
                        t_view.cam_lookat_z = cam_lookat_z;

                        //quatunion of camera
                        t_view.cam_quat_x = cam_quat_x;
                        t_view.cam_quat_y = cam_quat_y;
                        t_view.cam_quat_z = cam_quat_z;
                        t_view.cam_quat_w = cam_quat_w;

                        //OrbitControl Target
                        t_view.obt_target_x = obt_target_x;
                        t_view.obt_target_y = obt_target_y;
                        t_view.obt_target_z = obt_target_z;

                        // Update DB

                        await _context.AddAsync(t_view);
                        await _context.SaveChangesAsync();

                        TempData["ResultMsg"] = "AddNew Success";
                        return RedirectToAction("EditArticleWholeContents", "ContentsEdit", new { id_article = id_article });
                    } else
                    {

                        // データ更新
                        target.title = title;
                        //カメラ位置
                        target.cam_pos_x = cam_pos_x;
                        target.cam_pos_y = cam_pos_y;
                        target.cam_pos_z = cam_pos_z;

                        //Lookat(現状まともに動いていない)
                        target.cam_lookat_x = cam_lookat_x;
                        target.cam_lookat_y = cam_lookat_y;
                        target.cam_lookat_z = cam_lookat_z;

                        //カメラのクオータニオン
                        target.cam_quat_x = cam_quat_x;
                        target.cam_quat_y = cam_quat_y;
                        target.cam_quat_z = cam_quat_z;
                        target.cam_quat_w = cam_quat_w;

                        //OrbitControlのターゲット
                        target.obt_target_x = obt_target_x;
                        target.obt_target_y = obt_target_y;
                        target.obt_target_z = obt_target_z;

                        // DBに更新を反映
                        await _context.SaveChangesAsync();


                        TempData["ResultMsg"] = "Update Success";
                        return RedirectToAction("EditArticleWholeContents", "ContentsEdit", new { id_article = id_article });

                    }

                }
                catch
                {
                    TempData["ResultMsg"] = "Update Failed";
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(id_article);
        }

        // GET: t_view/Delete/5
        public async Task<IActionResult> Delete(long? id_article, int? id_view )
        {
            if (id_article == null | id_view == null)
            {
                return NotFound();
            }

            var t_view = await _context.t_views
                .Include(t => t.id_articleNavigation)
                .FirstOrDefaultAsync(m => m.id_article == id_article & m.id_view == id_view);
            if (t_view == null)
            {
                return NotFound();
            }

            return View(t_view);
        }

        // POST: t_view/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id_article, int id_view)
        {
            var t_view = await _context.t_views.FindAsync(id_article, id_view);
            _context.t_views.Remove(t_view);
            await _context.SaveChangesAsync();
            //return RedirectToAction(nameof(Index),new { id_article = id_article });
            return RedirectToAction(nameof(ContentsEditController.EditProductInstruction),new { controller = "ContentsEdit", id_article = id_article });

            //ContentsEdit / EditProductInstruction
        }

        private bool t_viewExists(long id)
        {
            return _context.t_views.Any(e => e.id_article == id);
        }
    }
}
