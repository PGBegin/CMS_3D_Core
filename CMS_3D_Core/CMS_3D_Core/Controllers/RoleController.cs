/*
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS_3D_Core.Controllers
{
    public class RoleController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
*/


using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CMS_3D_Core.Models;

namespace CMS_3D_Core.Controllers
{
    public class RoleController : Controller
    {
        // コントローラーを呼び出すと DI により自動的にコンストラクタに
        // UserManager<MySQLIdentityUser> と RoleManager<IdentityRole>
        // オブジェクトへの参照が渡される
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        // GET: Role/Index
        public async Task<IActionResult> Index()
        {
            var roles = from r in _roleManager.Roles
                        orderby r.Name
                        select new RoleViewModel
                        {
                            Id = r.Id,
                            Name = r.Name
                        };

            return View(await roles.ToListAsync());
        }




        // GET: Role/Create
        // Model は RoleViewModel クラス
        public IActionResult Create()
        {
            return View();
        }

        // POST: Role/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(
                            [Bind("Id,Name")] RoleViewModel model)
        {
            if (ModelState.IsValid)
            {
                // ユーザーが入力したロール名を model.Name から
                // 取得し IdentityRole オブジェクトを生成
                var role = new IdentityRole { Name = model.Name };

                //　上の IdentityRole から新規ロールを作成・登録
                var result = await _roleManager.CreateAsync(role);

                if (result.Succeeded)
                {
                    // 登録に成功したら Role/Index にリダイレクト
                    return RedirectToAction("Index", "Role");
                }

                // result.Succeeded が false の場合 ModelSate にエ
                // ラー情報を追加しないとエラーメッセージが出ない。
                // Register.cshtml.cs のものをコピー
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty,
                                             error.Description);
                }
            }

            // ロールの登録に失敗した場合、登録画面を再描画
            return View(model);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var target = await _roleManager.FindByIdAsync(id);

            if (target == null)
            {
                return NotFound();
            }

            RoleViewModel model = new RoleViewModel
            {
                Name = target.Name
            };

            return View(model);
        }

        // POST: Role/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id,
                        [Bind("Id,Name")] RoleViewModel model)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var target = await _roleManager.FindByIdAsync(id);
                if (target == null)
                {
                    return NotFound();
                }

                // ユーザーが入力したロール名を model.Name から取得し
                // て IdentityRole の Name を書き換え
                target.Name = model.Name;

                // Name を書き換えた IdentityRole で更新をかける
                var result = await _roleManager.UpdateAsync(target);

                if (result.Succeeded)
                {
                    // 更新に成功したら Role/Index にリダイレクト
                    return RedirectToAction("Index", "Role");
                }

                // result.Succeeded が false の場合 ModelSate にエ
                // ラー情報を追加しないとエラーメッセージが出ない。
                // Register.cshtml.cs のものをコピー
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty,
                                             error.Description);
                }
            }

            // 更新に失敗した場合、編集画面を再描画
            return View(model);
        }

        // GET: Role/Delete/5
        // 階層更新が行われているようで、ユーザーがアサインされて
        // いるロールも削除可能。
        // Model は RoleModel
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var role = await _roleManager.FindByIdAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            var model = new RoleViewModel
            {
                Id = role.Id,
                Name = role.Name
            };

            return View(model);
        }

        // POST: Role/Delete/5
        // 上の Delete(string id) と同シグネチャのメソッド
        // は定義できないので、メソッド名を変えて、下のよう
        // に ActionName("Delete") を設定する
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var role = await _roleManager.FindByIdAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            // ユーザーがアサインされているロールも以下の一行で
            // 削除可能。内部で階層更新が行われているらしい。
            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                // 削除に成功したら Role/Index にリダイレクト
                return RedirectToAction("Index", "Role");
            }

            // result.Succeeded が false の場合 ModelSate にエ
            // ラー情報を追加しないとエラーメッセージが出ない。
            // Register.cshtml.cs のものをコピー
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty,
                                         error.Description);
            }
            // 削除に失敗した場合、削除画面を再描画
            var model = new RoleViewModel
            {
                Id = role.Id,
                Name = role.Name
            };

            return View(model);
        }
    }
}
