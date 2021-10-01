
function GetScreenshotForUpload(id_parent_element, id_img, id_img_input) {
    var imgData;

    try {
        var strMime = "image/jpeg";
        renderer.render(scene, camera_main);
        imgData = renderer.domElement.toDataURL(strMime);


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




//var strDownloadMime = "image/octet-stream";
/*

var imgresizeToSrc = function (img, w, h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL();
}
*/

function saveAsImage() {
    var imgData;
    //var imgNode;
    //var img = new Image();
    //img.height = 270;
    //img.width = 480;

    try {
        var strMime = "image/jpeg";
        renderer.render(scene, camera_main);
        imgData = renderer.domElement.toDataURL(strMime);
        //img.src = renderer.domElement.toDataURL(strMime);
        //var src = imgresizeToSrc(img, 480, 270);



        var temp_bt = document.createElement('img');

        temp_bt.id = "getimage";

        temp_bt.src = imgData;

        var pn = document.getElementById('gitpicture');
        pn.appendChild(temp_bt);



        //document.getElementById('up_img_input').setAttribute('value', src);
        //document.getElementById('up_img_input').setAttribute('value', imgData.replace(strMime, strDownloadMime));
        document.getElementById('up_img_input').setAttribute('value', imgData);
        document.getElementById('up_img_submit').disabled = false;


        //saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

    } catch (e) {
        console.log(e);
        return;
    }

}

/*
 * Convert Screen shot to File and Download
var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}
*/
/*
const canvas = document.querySelector('#model_screen');
const elem = document.querySelector('#screenshot');
elem.addEventListener('click', () => {
    canvas.toBlob((blob) => {
        saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
    });
});

const saveBlob = (function () {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
    };
}());*/