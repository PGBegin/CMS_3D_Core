
/*
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';




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

    for (let i in data) {
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
}



//コントロールパネル領域を生成する
function setup_control_panel_zone(elementid, instruction_gp) {

    let pn = document.getElementById(elementid);

    instruction_gp.forEach(function (element) {

        temp_bt = document.createElement('button');
        temp_bt.type = 'button';
        temp_bt.onclick = transition_instruction.bind(null, element.id_instruct);
        temp_bt.id = "btn_inst" + element.id_instruct;
        temp_bt.classList.add('btn');
        temp_bt.classList.add('btn-outline-primary');
        temp_bt.textContent = element.title;

        pn.appendChild(temp_bt);
    });
}






//データモデルを取得する
function setup_instance_part_model(str_url_partapi_base, instance_part, glfLoader, scene) {

    let str_url_partapi = "";
    instance_part.forEach(function (element) {
        str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: element.id_part }).toString();
        console.log(str_url_partapi);

        glfLoader.load(str_url_partapi, function (gltf) {


            document.getElementById('div_progressbar_modeldl').setAttribute('hidden', '');
            scene.add(gltf.scene);

        }, function (xhr) {

            //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            document.getElementById('progressbar_modeldl').setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

        }, function (error) {

            console.error(error);

        });
    });
}



var camera_main;
var scene = new THREE.Scene();
var controls;

var gridHelper;
var axisHelper;
var lightHelper;

var light;
var ambient;
var renderer;
var width = 720;
var height = 405;

var view_object = [];
var instruction_gp = [];
var instance_part = [];

var orbit_active = false;


// ロード後に実行される処理
function startup() {
 //   'use strict';

    var str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";

    const glfLoader = new GLTFLoader();


    

    //データモデルを取得する
    //get_model(str_url_partapi_base, @Model.id_part, glfLoader, scene);
    get_model(str_url_partapi_base, document.getElementById("id_part").value, glfLoader, scene);


    //表示領域を初期化する
    initial_setup_and_render();

    initial_optional01();

    //orbitコントロールモードを有効にし、レンダリングを開始する
    orbit_active = true;
    render_orbital();


}

//Load時のイベントリスナ追加
window.addEventListener('load', startup);

//指定されたIDのインストラクションを表示する
function transition_instruction(id_instruct) {
    'use strict';


    orbit_active = false;

    //カメラ位置の変更
    //---------------------
    var i = instruction_gp[id_instruct].id_view;


    // 視点のアニメーションによる移行
    // ------------------------------------------------------------------------------------------------
    var counter = 0;
    var step = 75;

    var pitch_px = (view_object[i].cam_pos_x - camera_main.position.x) / step;
    var pitch_py = (view_object[i].cam_pos_y - camera_main.position.y) / step;
    var pitch_pz = (view_object[i].cam_pos_z - camera_main.position.z) / step;

    var pitch_tx = (view_object[i].obt_target_x - controls.target.x) / step;
    var pitch_ty = (view_object[i].obt_target_y - controls.target.y) / step;
    var pitch_tz = (view_object[i].obt_target_z - controls.target.z) / step;


    function flight() {

        update_viewinfo();

        if (counter >= step) {
            orbit_active = true;

            render_orbital();
            return;
        } else {
            counter = counter + 1;
            requestAnimationFrame(flight);

            camera_main.position.x += pitch_px;
            camera_main.position.y += pitch_py;
            camera_main.position.z += pitch_pz;


            controls.target.x += pitch_tx;
            controls.target.y += pitch_ty;
            controls.target.z += pitch_tz;

            controls.update();
            renderer.render(scene, camera_main);
        }
    }
    flight();


}


//データモデルを取得する
function get_model(str_url_partapi_base, id_part, glfLoader, scene) {

    var str_url_partapi = "";
    str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: id_part }).toString();

    glfLoader.load(str_url_partapi, function (gltf) {


        document.getElementById('div_progressbar_modeldl').setAttribute('hidden', '');
        scene.add(gltf.scene);

    }, function (xhr) {

        document.getElementById('progressbar_modeldl').setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

    }, function (error) {

        console.error(error);

    });
}

//表示関連を初期化する
function initial_setup_and_render() {
    'use strict';

    // light
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(30, 30, 30);
    scene.add(light);



    ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

    // main camara
    camera_main = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xefefef);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('model_screen').appendChild(renderer.domElement);

    controls = new OrbitControls(camera_main, renderer.domElement);




    camera_main.position.x = 10;
    camera_main.position.y = 10;
    camera_main.position.z = 10;

    controls.target.x = 0;
    controls.target.y = 0;
    controls.target.z = 0;
};

//通常の、orbit control有効状態でのレンダリング
function render_orbital() {
    update_viewinfo();
    if (!orbit_active) { return; }
    requestAnimationFrame(render_orbital);


    controls.update();
    renderer.render(scene, camera_main);
}


//表示関連を初期化する
function initial_optional01() {
    'use strict';


    //helper

    gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);


    axisHelper = new THREE.AxisHelper(1000);
    scene.add(axisHelper);


    lightHelper = new THREE.DirectionalLightHelper(light, 20);
    scene.add(lightHelper);
};

function update_viewinfo() {


    document.getElementById('cam_pos_x').value = Math.floor(camera_main.position.x * 100) / 100;
    document.getElementById('cam_pos_y').value = Math.floor(camera_main.position.y * 100) / 100;
    document.getElementById('cam_pos_z').value = Math.floor(camera_main.position.z * 100) / 100;

    document.getElementById('cam_lookat_x').value = 0;
    document.getElementById('cam_lookat_y').value = 0;
    document.getElementById('cam_lookat_z').value = 0;

    document.getElementById('cam_quat_x').value = Math.floor(camera_main.quaternion.x * 1000) / 1000;
    document.getElementById('cam_quat_y').value = Math.floor(camera_main.quaternion.y * 1000) / 1000;
    document.getElementById('cam_quat_z').value = Math.floor(camera_main.quaternion.z * 1000) / 1000;
    document.getElementById('cam_quat_w').value = Math.floor(camera_main.quaternion.w * 1000) / 1000;

    document.getElementById('obt_target_x').value = Math.floor(controls.target.x * 100) / 100;
    document.getElementById('obt_target_y').value = Math.floor(controls.target.y * 100) / 100;
    document.getElementById('obt_target_z').value = Math.floor(controls.target.z * 100) / 100;

}

export { startup }

*/
//-----------------------------------------------------------------------------

/*
setLoading() {
    // glTF形式の3Dモデルを読み込む
    const loader = new GLTFLoader();
    loader.load(srcObj, (obj) => {
        item3d = obj.scene;
        // 3Dモデルをredrawに入れる
        //this.three.redraw = data;
        // 3Dモデルの初期サイズ設定
        //data.scale.set(0.8, 0.8, 0.8);
        // シーンに3Dモデルを追加
        //this.three.scene.add(data);
        // レンダリングを開始する
        //this.rendering();
    });
}
//-----------------------------------------------------------------------------
*/
/*
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)


//API URL Base
const str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";
const str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: '3' }).toString();
//const srcObj = '../data/qiitan.glb';
let item3d;
const loader = new GLTFLoader();
loader.load(str_url_partapi, (obj) => {
    item3d = obj.scene;
    scene.add(item3d);
});

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()

*/