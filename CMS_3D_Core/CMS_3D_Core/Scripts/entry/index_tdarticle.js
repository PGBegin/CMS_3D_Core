
import { TDArticle } from '../src/tdarticle.js';
import { GetScreenshotForUpload } from '../src/GetScreenshot.js';



var adarticle = new TDArticle();


// ロード後に実行される処理
function startup() {


    const is_mode_assy = toBoolean(document.getElementById("is_mode_assy").value);
    const is_edit_mode = toBoolean(document.getElementById("is_edit_mode").value);


    if (is_mode_assy) {
        adarticle.is_mode_assy = is_mode_assy;
        adarticle.id_assy = Number(document.getElementById("id_assy").value);
        adarticle.is_edit_mode = is_edit_mode;

    } else {

        adarticle.id_article = Number(document.getElementById("id_article").value);
        adarticle.is_edit_mode = is_edit_mode;


        window.addEventListener("resize", function () { adarticle.onWindowResize(); }, false);

        if (adarticle.is_edit_mode) {
            document.getElementById("screenshot").addEventListener('click', function () {
                GetScreenshotForUpload(adarticle,'view_capture', 'getimage', 'up_img_input');
            });

            document.getElementById("DbUpdateInstruction").addEventListener('click', function () {
                adarticle.DbUpdateInstruction();
            });

            document.getElementById("DbDeleteInstruction").addEventListener('click', function () {
                adarticle.DbDeleteInstruction();
            });

            document.getElementById("DbUpdateView").addEventListener('click', function () {
                adarticle.DbUpdateView();
            });

            document.getElementById("DbUpdateAnnotation").addEventListener('click', function () {
                adarticle.DbUpdateAnnotation();
            });

            document.getElementById("DbDeleteAnnotation").addEventListener('click', function () {
                adarticle.DbDeleteAnnotation();
            });

            document.getElementById("DbUpdateAnnotationDisplay").addEventListener('click', function () {
                adarticle.DbUpdateAnnotationDisplay();
            });

        }

    }

    adarticle.ComplexSetupEnvironmentInitial();


    function toBoolean(data) {
        return data.toLowerCase() === 'true';
    }
}


//Load時のイベントリスナ追加
window.addEventListener('load', startup);

