
//import { TDArticle } from '../src/tdarticle.js';
import { TDArticle } from '../src/tdarticle';
import { GetScreenshotForUpload } from '../src/GetScreenshot';



var adarticle = new TDArticle();


// ロード後に実行される処理
function startup() {


    const is_mode_assy = false;
    const is_edit_mode = false;

    adarticle.datacontainers.str_url_base_prodobjectapi_articlemode = "https://aptdaerospacemuseumstaging.azurewebsites.net//ContentsOperatorForArticleApis/GetArticleObjectWholeData?";

    if (is_mode_assy) {
        adarticle.datacontainers.is_mode_assy = is_mode_assy;
        adarticle.datacontainers.id_assy = Number((<HTMLInputElement>document.getElementById("id_assy")).value);
        adarticle.is_edit_mode = is_edit_mode;

    } else {

        adarticle.datacontainers.id_article = Number((<HTMLInputElement>document.getElementById("id_article")).value);
        adarticle.is_edit_mode = is_edit_mode;


        window.addEventListener("resize", function () { adarticle.onWindowResize(); }, false);

        if (adarticle.is_edit_mode) {
            document.getElementById("screenshot")!.addEventListener('click', function () {
                GetScreenshotForUpload(adarticle, 'view_capture', 'getimage', 'up_img_input');
            });

            document.getElementById("DbUpdateInstruction")!.addEventListener('click', function () {
                adarticle.DbUpdateInstruction();
            });

            document.getElementById("DbDeleteInstruction")!.addEventListener('click', function () {
                adarticle.DbDeleteInstruction();
            });

            document.getElementById("DbUpdateView")!.addEventListener('click', function () {
                adarticle.DbUpdateView();
            });

            document.getElementById("DbUpdateAnnotation")!.addEventListener('click', function () {
                adarticle.DbUpdateAnnotation();
            });

            document.getElementById("DbDeleteAnnotation")!.addEventListener('click', function () {
                adarticle.DbDeleteAnnotation();
            });

            document.getElementById("DbUpdateAnnotationDisplay")!.addEventListener('click', function () {
                adarticle.DbUpdateAnnotationDisplay();
            });

        }

    }

    adarticle.ComplexSetupEnvironmentInitial();


    function toBoolean(data: any) {
        return data.toLowerCase() === 'true';
    }
}


//Load時のイベントリスナ追加
window.addEventListener('load', startup);

