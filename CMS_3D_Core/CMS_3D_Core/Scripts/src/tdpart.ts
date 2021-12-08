

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';




class Instruction {

    id_article: number;
    id_instruct: number;
    id_view: number;


    title: string;
    short_description: string;

    display_order: number;

    memo: string;
    constructor(id_article: number, id_instruct: number, id_view: number, title: string, short_description: string, display_order: number, memo: string) {
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

    id_article: number;
    id_view: number;

    title: string;

    cam_pos_x: number;
    cam_pos_y: number;
    cam_pos_z: number;

    cam_lookat_x: number;
    cam_lookat_y: number;
    cam_lookat_z: number;

    cam_quat_x: number;
    cam_quat_y: number;
    cam_quat_z: number;
    cam_quat_w: number;

    obt_target_x: number;
    obt_target_y: number;
    obt_target_z: number;
    constructor(id_article: number, id_view: number, title: string,
        cam_pos_x: number, cam_pos_y: number, cam_pos_z: number, cam_lookat_x: number, cam_lookat_y: number, cam_lookat_z: number,
        cam_quat_x: number, cam_quat_y: number, cam_quat_z: number, cam_quat_w: number, obt_target_x: number, obt_target_y: number, obt_target_z: number) {

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
    id_assy: number;
    id_inst: number;
    id_part: number;
    objectdata: any;
    constructor(id_assy: number, id_inst: number, id_part: number, objectdata: any) {
        this.id_assy = id_assy;
        this.id_inst = id_inst;
        this.id_part = id_part;
        this.objectdata = objectdata;
    }
}


var camera_main: any;
var scene = new THREE.Scene();
var controls: any;

var gridHelper;
var axisHelper;
var lightHelper;

var light: any;
var ambient;
var renderer: any;
var width = 720;
var height = 405;

/*
var view_object: ViewObject[];// = [];
var instruction_gp: any = [];
var instance_part = [];
*/
var orbit_active = false;


// ロード後に実行される処理
function startup() {

    var str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";

    const glfLoader = new GLTFLoader();




    //データモデルを取得する
    get_model(str_url_partapi_base, (<HTMLInputElement>document.getElementById("id_part")).value, glfLoader, scene);


    //表示領域を初期化する
    initial_setup_and_render();

    initial_optional01();

    //orbitコントロールモードを有効にし、レンダリングを開始する
    orbit_active = true;
    render_orbital();


}

//Load時のイベントリスナ追加
window.addEventListener('load', startup);


//データモデルを取得する
function get_model(str_url_partapi_base : string, id_part : any, glfLoader : any, scene : any) {

    var str_url_partapi = "";
    str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: id_part }).toString();

    glfLoader.load(str_url_partapi, function (gltf : any) {


        (<HTMLInputElement>document.getElementById('div_progressbar_modeldl')).setAttribute('hidden', '');
        scene.add(gltf.scene);

    }, function (xhr : any) {

        (<HTMLInputElement>document.getElementById('progressbar_modeldl')).setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

    }, function (error : any) {

        console.error(error);

    });
}

//表示関連を初期化する
function initial_setup_and_render() {

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
    (<HTMLInputElement>document.getElementById('model_screen')).appendChild(renderer.domElement);

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


    //helper

    gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);


    //axisHelper = new THREE.AxisHelper(1000);
    //scene.add(axisHelper);


    lightHelper = new THREE.DirectionalLightHelper(light, 20);
    scene.add(lightHelper);
};

function update_viewinfo() {


    (<HTMLInputElement>document.getElementById('cam_pos_x')).value = (Math.floor(camera_main.position.x * 100) / 100).toString();
    (<HTMLInputElement>document.getElementById('cam_pos_y')).value = (Math.floor(camera_main.position.y * 100) / 100).toString();
    (<HTMLInputElement>document.getElementById('cam_pos_z')).value = (Math.floor(camera_main.position.z * 100) / 100).toString();

    (<HTMLInputElement>document.getElementById('cam_lookat_x')).value = "0";
    (<HTMLInputElement>document.getElementById('cam_lookat_y')).value = "0";
    (<HTMLInputElement>document.getElementById('cam_lookat_z')).value = "0";

    (<HTMLInputElement>document.getElementById('cam_quat_x')).value = (Math.floor(camera_main.quaternion.x * 1000) / 1000).toString();
    (<HTMLInputElement>document.getElementById('cam_quat_y')).value = (Math.floor(camera_main.quaternion.y * 1000) / 1000).toString();
    (<HTMLInputElement>document.getElementById('cam_quat_z')).value = (Math.floor(camera_main.quaternion.z * 1000) / 1000).toString();
    (<HTMLInputElement>document.getElementById('cam_quat_w')).value = (Math.floor(camera_main.quaternion.w * 1000) / 1000).toString();

    (<HTMLInputElement>document.getElementById('obt_target_x')).value = (Math.floor(controls.target.x * 100) / 100).toString();
    (<HTMLInputElement>document.getElementById('obt_target_y')).value = (Math.floor(controls.target.y * 100) / 100).toString();
    (<HTMLInputElement>document.getElementById('obt_target_z')).value = (Math.floor(controls.target.z * 100) / 100).toString();

}

export { startup }