
export function GetScreenshotForUpload(adarticle,id_parent_element, id_img, id_img_input) {
    var imgData;
    let obj = adarticle;

    try {
        var strMime = "image/jpeg";
        //obj.renderer.render(obj.scene, obj.camera_main);
        console.log(adarticle);
        console.log(adarticle.renderer);
        adarticle.renderer.render(adarticle.scene, adarticle.camera_main);
        imgData = obj.renderer.domElement.toDataURL(strMime);



        var temp_bt = document.getElementById(id_img);

        if (temp_bt) {
        }
        else {
            temp_bt = document.createElement('img');
            temp_bt.id = id_img;
            var pn = document.getElementById(id_parent_element);
            pn.appendChild(temp_bt);

        }


        temp_bt.src = imgData;

        document.getElementById(id_img_input).setAttribute('value', imgData);
        document.getElementById('up_img_submit').disabled = false;


    } catch (e) {
        console.log(e);
        return;
    }

}