
import { TDArticle } from './tdarticle';

export function GetScreenshotForUpload(adarticle: TDArticle, id_parent_element: string, id_img: string, id_img_input: string) {

    //let obj = adarticle;

    let imgData: string;
    let temp_bt: HTMLImageElement;
    const strMime = "image/jpeg";

    try {

        //obj.renderer.render(obj.scene, obj.camera_main);
        //console.log(adarticle);
        //console.log(adarticle.renderer);

        adarticle.renderer.render(adarticle.scene, adarticle.camera_main);
        imgData = adarticle.renderer.domElement.toDataURL(strMime);



        temp_bt = <HTMLImageElement>document.getElementById(id_img);

        if (temp_bt) {
        }
        else {
            temp_bt = document.createElement('img');
            temp_bt.id = id_img;
            var pn = document.getElementById(id_parent_element)!;
            pn.appendChild(temp_bt);

        }


        temp_bt.src = imgData;

        (<HTMLInputElement>document.getElementById(id_img_input)).setAttribute('value', imgData);
        (<HTMLInputElement>document.getElementById('up_img_submit')).disabled = false;


    } catch (e) {
        console.log(e);
        return;
    }

}