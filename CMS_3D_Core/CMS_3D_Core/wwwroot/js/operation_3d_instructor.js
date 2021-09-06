


class Instruction {
    constructor(id_article, id_instruct, id_view, title, short_description, display_order, memo) {
        this.id_article = id_article;
        this.id_instruct = id_instruct;
        this.id_view = id_view;
        this.title = title;
        this.short_description = short_description;
        this.display_order = display_order;
        this.memo = memo;
    }
}

class ViewObject {
    constructor(id_article, id_view, title,
        cam_pos_x, cam_pos_y, cam_pos_z, cam_lookat_x, cam_lookat_y, cam_lookat_z,
        cam_quat_x, cam_quat_y, cam_quat_z, cam_quat_w, obt_target_x, obt_target_y, obt_target_z) {

        this.title = title;
        this.id_article = id_article;
        this.id_view = id_view;

        this.cam_pos_x = cam_pos_x;
        this.cam_pos_y = cam_pos_y;
        this.cam_pos_z = cam_pos_z;

        this.cam_lookat_x = cam_lookat_x;
        this.cam_lookat_y = cam_lookat_y;
        this.cam_lookat_z = cam_lookat_z;

        this.cam_quat_x = cam_quat_x;
        this.cam_quat_y = cam_quat_y;
        this.cam_quat_z = cam_quat_z;
        this.cam_quat_w = cam_quat_w;

        this.obt_target_x = obt_target_x;
        this.obt_target_y = obt_target_y;
        this.obt_target_z = obt_target_z;
    }
}


class InstancePart {
    constructor(id_assy, id_inst, id_part, objectdata) {
        this.id_assy = id_assy;
        this.id_inst = id_inst;
        this.id_part = id_part;
        this.objectdata = objectdata;
    }
}


function data_inmprt(data, view_object, instruction_gp, instance_part) {

    for (var i in data) {
        if (data[i].type == "view") {
            view_object[data[i].id_view] = new ViewObject(

                data[i].id_article,
                data[i].id_view,
                data[i].title,
                
                data[i].cam_pos_x,
                data[i].cam_pos_y,
                data[i].cam_pos_z,

                data[i].cam_lookat_x,
                data[i].cam_lookat_y,
                data[i].cam_lookat_z,

                data[i].cam_quat_x,
                data[i].cam_quat_y,
                data[i].cam_quat_z,
                data[i].cam_quat_w,

                data[i].obt_target_x,
                data[i].obt_target_y,
                data[i].obt_target_z
            );
        }


        if (data[i].type == "instruction") {

            instruction_gp[data[i].id_instruct] = new Instruction(
                data[i].id_article,
                data[i].id_instruct,
                data[i].id_view,
                data[i].title,
                data[i].short_description,
                data[i].display_order,
                data[i].memo
            );

        }


        if (data[i].type == "instance_part") {

            instance_part[data[i].id_inst] = new InstancePart(
                data[i].id_assy,
                data[i].id_inst,
                data[i].id_part, null);
        }
    }
}


//カメラを設定する
function set_camera(objcom, p1, p2, p3, qt) {
    'use strict';
    objcom.position.set(p1, p2, p3);
    qt.normalize();

    objcom.setRotationFromQuaternion(qt);
    //console.log("x:" + look.x + "y:" + look.y + "z:" + look.z);
}
    /*
//カメラを設定する
function set_camera(objcom, p1, p2, p3, look) {
    'use strict';
    objcom.position.set(p1, p2, p3);
    objcom.lookAt(look);
    console.log("x:" + look.x + "y:" + look.y + "z:" + look.z);
}
*/



//コントロールパネル領域を生成する
function setup_control_panel_zone(elementid, instruction_gp) {

    var pn = document.getElementById(elementid);

    instruction_gp.forEach(function (element) {

        temp_bt = document.createElement('button');
        temp_bt.type = 'button';
        temp_bt.onclick = transition_instruction.bind(null, element.id_instruct);
        temp_bt.id = "btn_inst" + element.id_instruct;
        temp_bt.classList.add('btn');
        temp_bt.classList.add('btn-primary');
        temp_bt.textContent = element.title;

        pn.appendChild(temp_bt);
    });
}






//データモデルを取得する
function setup_instance_part_model(str_url_partapi_base, instance_part, glfLoader, scene) {

    var str_url_partapi = "";
    instance_part.forEach(function (element) {
        str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: element.id_part }).toString();


        glfLoader.load(str_url_partapi, function (gltf) {

            scene.add(gltf.scene);

        }, undefined, function (error) {

            console.error(error);

        });
    });
}


/*

//表示関連を初期化する
function initial_setup_and_render2(scene, camera_main, controls, light, ambient, renderer, width, height) {
    'use strict';

    // light
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 100, 30);
    scene.add(light);


    ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

    // main camara
    camera_main = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    set_camera(camera_main, 30, 30, 30, new THREE.Quaternion(0.017, 0.168, -0.003, 0.985));

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xefefef);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('model_screen').appendChild(renderer.domElement);


    controls = new THREE.OrbitControls(camera_main, renderer.domElement);


    function render() {
        requestAnimationFrame(render);

        controls.update();
        renderer.render(scene, camera_main);
    }
    render();

};

*/