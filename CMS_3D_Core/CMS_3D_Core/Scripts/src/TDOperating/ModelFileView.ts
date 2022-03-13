

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ModelViewing {
    camera_main: any;
    scene :THREE.Scene;
    controls!: OrbitControls;

    gridHelper: any;
    axisHelper: any;
    lightHelper: any;

    light: any;
    ambient: any;
    renderer: any;
    width = 720;
    height = 405;


    orbit_active: boolean = false;


    constructor() {

        this.scene = new THREE.Scene();
    }
    // ロード後に実行される処理
    startup(modelid: number) {

        var str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";

        const glfLoader = new GLTFLoader();




        //データモデルを取得する
        this.get_model(str_url_partapi_base, modelid, glfLoader, this.scene);
        //get_model(str_url_partapi_base, (<HTMLInputElement>document.getElementById("id_part")).value, glfLoader, scene);


        //表示領域を初期化する
        this.initial_setup_and_render();

        this.initial_optional01();

        //orbitコントロールモードを有効にし、レンダリングを開始する
        this.orbit_active = true;
        this.render_orbital();


    }
    //Load時のイベントリスナ追加
    //window.addEventListener('load', startup);


    //データモデルを取得する
    get_model(str_url_partapi_base: string, id_part: any, glfLoader: any, scene: any) {

        var str_url_partapi = "";
        str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: id_part }).toString();

        glfLoader.load(str_url_partapi, function (gltf: any) {


            (<HTMLInputElement>document.getElementById('div_progressbar_modeldl')).setAttribute('hidden', '');
            scene.add(gltf.scene);

        }, function (xhr: any) {

            //(<HTMLInputElement>document.getElementById('progressbar_modeldl')).setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

        }, function (error: any) {

            console.error(error);

        });
    }

    //表示関連を初期化する
    initial_setup_and_render() {

        // light
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(30, 30, 30);
        this.scene.add(this.light);



        this.ambient = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(this.ambient);

        // main camara
        this.camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);

        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xefefef);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        (<HTMLInputElement>document.getElementById('model_screen')).appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera_main, this.renderer.domElement);




        this.camera_main.position.x = 10;
        this.camera_main.position.y = 10;
        this.camera_main.position.z = 10;

        this.controls.target.x = 0;
        this.controls.target.y = 0;
        this.controls.target.z = 0;
    };

    //通常の、orbit control有効状態でのレンダリング
    render_orbital() {
        //this.update_viewinfo();
        if (!this.orbit_active) { return; }
        requestAnimationFrame(this.render_orbital);


        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);
    }


    //表示関連を初期化する
    initial_optional01() {


        //helper

        this.gridHelper = new THREE.GridHelper(200, 200);
        this.scene.add(this.gridHelper);


        //axisHelper = new THREE.AxisHelper(1000);
        //scene.add(axisHelper);


        this.lightHelper = new THREE.DirectionalLightHelper(this.light, 20);
        this.scene.add(this.lightHelper);
    };

    update_viewinfo() {


        (<HTMLInputElement>document.getElementById('cam_pos_x')).value = (Math.floor(this.camera_main.position.x * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('cam_pos_y')).value = (Math.floor(this.camera_main.position.y * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('cam_pos_z')).value = (Math.floor(this.camera_main.position.z * 100) / 100).toString();

        (<HTMLInputElement>document.getElementById('cam_lookat_x')).value = "0";
        (<HTMLInputElement>document.getElementById('cam_lookat_y')).value = "0";
        (<HTMLInputElement>document.getElementById('cam_lookat_z')).value = "0";

        (<HTMLInputElement>document.getElementById('cam_quat_x')).value = (Math.floor(this.camera_main.quaternion.x * 1000) / 1000).toString();
        (<HTMLInputElement>document.getElementById('cam_quat_y')).value = (Math.floor(this.camera_main.quaternion.y * 1000) / 1000).toString();
        (<HTMLInputElement>document.getElementById('cam_quat_z')).value = (Math.floor(this.camera_main.quaternion.z * 1000) / 1000).toString();
        (<HTMLInputElement>document.getElementById('cam_quat_w')).value = (Math.floor(this.camera_main.quaternion.w * 1000) / 1000).toString();

        (<HTMLInputElement>document.getElementById('obt_target_x')).value = (Math.floor(this.controls.target.x * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('obt_target_y')).value = (Math.floor(this.controls.target.y * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('obt_target_z')).value = (Math.floor(this.controls.target.z * 100) / 100).toString();

    }

}
/*
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


var orbit_active = false;


// ロード後に実行される処理
function startup(modelid: number) {

    var str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";

    const glfLoader = new GLTFLoader();




    //データモデルを取得する
    get_model(str_url_partapi_base, modelid, glfLoader, scene);
    //get_model(str_url_partapi_base, (<HTMLInputElement>document.getElementById("id_part")).value, glfLoader, scene);


    //表示領域を初期化する
    initial_setup_and_render();

    initial_optional01();

    //orbitコントロールモードを有効にし、レンダリングを開始する
    orbit_active = true;
    render_orbital();


}

//Load時のイベントリスナ追加
//window.addEventListener('load', startup);


//データモデルを取得する
function get_model(str_url_partapi_base: string, id_part: any, glfLoader: any, scene: any) {

    var str_url_partapi = "";
    str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: id_part }).toString();

    glfLoader.load(str_url_partapi, function (gltf: any) {


        (<HTMLInputElement>document.getElementById('div_progressbar_modeldl')).setAttribute('hidden', '');
        scene.add(gltf.scene);

    }, function (xhr: any) {

        //(<HTMLInputElement>document.getElementById('progressbar_modeldl')).setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

    }, function (error: any) {

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

    gridHelper = new THREE.GridHelper(200, 200);
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
*/