
var camera_main;
var controls;
var scene = new THREE.Scene();

var gridHelper;
var axisHelper;
var lightHelper;

var light;
var ambient;
var renderer;


var orbit_active = false;

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

//---------------------------------------------------------------------------
class TDArticle {

    /*
    pitch_px;
    pitch_py;
    pitch_pz;

    pitch_tx;
    pitch_ty;
    pitch_tz;

    counter;
    step;

    */
    constructor() {
        this.width = 720;
        this.height = 405;

        this.view_object = [];
        this.instruction_gp = [];
        this.instance_part = [];

        this.str_url_partapi_base = "/ContentsOperatorApis/GetPartObjectFile?";

        //this.orbit_active = true;

        //var scene = new THREE.Scene();

        //this.camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
        //this.controls = new THREE.OrbitControls(this.camera_main, renderer.domElement);


        this.counter = 0;
        this.step = 75;

        this.pitch_px = 0;
        this.pitch_py = 0;
        this.pitch_pz = 0;

        this.pitch_tx = 0;
        this.pitch_ty = 0;
        this.pitch_tz = 0;

        this.is_edit_mode = true;


    }

    startup(lint, lpx, lpy, lpz, anbint, _gammaOutput, str_url_prodobjectapi, id_startinst) {

        const glfLoader = new THREE.GLTFLoader();
        //指定urlからデータを取得
        fetch(str_url_prodobjectapi)
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ

                //JSONのデータを各オブジェクトに詰め替える
                adarticle.data_import(data);

                //コントロールパネル領域を生成する
                adarticle.setup_control_panel_zone("control_panel_zone");

                //データモデルを取得する
                adarticle.setup_instance_part_model(glfLoader, scene);

                //表示領域を初期化する
                adarticle.initial_optional01();


                adarticle.initial_setup_and_render(lint, lpx, lpy, lpz, anbint, _gammaOutput);


                //adarticle.transition_instruction(1);

                if (id_startinst == 0) {

                    camera_main.position.x = 30;
                    camera_main.position.y = 30;
                    camera_main.position.z = 30;


                    controls.target.x = 0;
                    controls.target.y = 0;
                    controls.target.z = 0;
                }
                else {
                    adarticle.transition_instruction(id_startinst);

                }

                //orbitコントロールモードを有効にし、レンダリングを開始する
                orbit_active = true;

                adarticle.render_orbital();
                //render_orbital();

            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });
    }





    //基本データを読み込む
    data_import(data) {

        for (let i in data) {
            if (data[i].type == "view") {
                this.view_object[data[i].id_view] = new ViewObject(

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

                this.instruction_gp[data[i].id_instruct] = new Instruction(
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

                this.instance_part[data[i].id_inst] = new InstancePart(
                    data[i].id_assy,
                    data[i].id_inst,
                    data[i].id_part, null);
            }
        }
    }


    //モデルデータを読み込む
    setup_instance_part_model(glfLoader, scene) {

        let str_url_partapi = "";
        console.log(this.str_url_partapi_base);

        let x = this.str_url_partapi_base;
        this.instance_part.forEach(function (element) {
            str_url_partapi = x + new URLSearchParams({ id_part: element.id_part }).toString();
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

    //コントロールパネル領域を生成する
    setup_control_panel_zone(elementid) {

        let pn = document.getElementById(elementid);
        let temp_bt;
        this.instruction_gp.forEach(function (element) {

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = transition_instruction2.bind(null, element.id_instruct);
            temp_bt.id = "btn_inst" + element.id_instruct;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = element.title;

            pn.appendChild(temp_bt);
        });
    }



    //表示関連を初期化する
    initial_optional01() {
        'use strict';


        //helper
        /*
        gridHelper = new THREE.GridHelper(200, 50);
        scene.add(gridHelper);


        axisHelper = new THREE.AxisHelper(1000);
        scene.add(axisHelper);
        */

        //lightHelper = new THREE.DirectionalLightHelper(light, 20);
        //scene.add(lightHelper);
    }

    //表示関連を初期化する
    initial_setup_and_render(lint, lpx, lpy, lpz, anbint, _gammaOutput) {

        // light
        light = new THREE.DirectionalLight(0xffffff, lint);
        light.position.set(lpx, lpy, lpz);
        scene.add(light);



        ambient = new THREE.AmbientLight(0x404040, anbint);
        scene.add(ambient);

        // main camara
        camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);

        // renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(adarticle.width, adarticle.height);
        renderer.setClearColor(0xefefef);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('model_screen').appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera_main, renderer.domElement);



        camera_main.position.x = 10;
        camera_main.position.y = 10;
        camera_main.position.z = 10;

        controls.target.x = 0;
        controls.target.y = 0;
        controls.target.z = 0;


        //ガンマ値をtrueに。
        //(truee.jsで一部のアイテムが暗くなるのを軽減)
        renderer.gammaOutput = _gammaOutput;

    }


    /*
    //指定されたIDのインストラクションに遷移する関数(旧世代)
    transition_instruction_o(id_instruct) {


        orbit_active = false;

        //カメラ位置の変更
        //---------------------
        let i = this.instruction_gp[id_instruct].id_view;


        // 視点のアニメーションによる移行
        // ------------------------------------------------------------------------------------------------

        let counter = 0;
        let step = 75;

        let pitch_px = (this.view_object[i].cam_pos_x - camera_main.position.x) / step;
        let pitch_py = (this.view_object[i].cam_pos_y - camera_main.position.y) / step;
        let pitch_pz = (this.view_object[i].cam_pos_z - camera_main.position.z) / step;

        let pitch_tx = (this.view_object[i].obt_target_x - controls.target.x) / step;
        let pitch_ty = (this.view_object[i].obt_target_y - controls.target.y) / step;
        let pitch_tz = (this.view_object[i].obt_target_z - controls.target.z) / step;

        
        function flight() {

            update_viewinfo();

            //this.update_viewinfo();

            if (counter >= step) {
                orbit_active = true;
                
                //render_orbital();
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
        this.update_instruction_statements(id_instruct);

    }
    */


    //指定されたIDのインストラクションに遷移する関数
    transition_instruction(id_instruct) {


        orbit_active = false;

        //カメラ位置の変更
        //---------------------
        let i = this.instruction_gp[id_instruct].id_view;


        // 視点のアニメーションによる移行
        // ------------------------------------------------------------------------------------------------

        this.counter = 0;
        this.step = 75;

        this.pitch_px = (this.view_object[i].cam_pos_x - camera_main.position.x) / this.step;
        this.pitch_py = (this.view_object[i].cam_pos_y - camera_main.position.y) / this.step;
        this.pitch_pz = (this.view_object[i].cam_pos_z - camera_main.position.z) / this.step;

        this.pitch_tx = (this.view_object[i].obt_target_x - controls.target.x) / this.step;
        this.pitch_ty = (this.view_object[i].obt_target_y - controls.target.y) / this.step;
        this.pitch_tz = (this.view_object[i].obt_target_z - controls.target.z) / this.step;


        this.render_trans();


        if (this.is_edit_mode) {
            this.update_instruction_statements_for_edit(id_instruct);
        }
        this.update_instruction_statements_for_view(id_instruct);

    }


    //視点変更(移動部分)
    render_trans() {

        //update_viewinfo();
        if (this.counter >= this.step) { return; }

        this.counter = this.counter + 1;
        camera_main.position.x += this.pitch_px;
        camera_main.position.y += this.pitch_py;
        camera_main.position.z += this.pitch_pz;


        controls.target.x += this.pitch_tx;
        controls.target.y += this.pitch_ty;
        controls.target.z += this.pitch_tz;

        controls.update();
        renderer.render(scene, camera_main);

        requestAnimationFrame(this.render_trans.bind(this));


        if (this.is_edit_mode) {
            this.update_viewinfo();
        }
    }

    //Update Instruction Statement and Controls for Display
    update_instruction_statements_for_view(id_instruct) {
        let i = this.instruction_gp[id_instruct].id_view;

        console.log(window.innerWidth);

        //Update Instruction for Preview
        document.getElementById('preview_instruction_short_description').innerHTML = marked(this.instruction_gp[id_instruct].short_description);

        //Set Color of button
        let children = document.getElementById('control_panel_zone').children;
        let buttunid = 'btn_inst' + id_instruct;
        for (var j = 0; j < children.length; j++) {

            if ("button".localeCompare(children[j].tagName, {}, { sensitivity: "base" }) == 0) {

                if (buttunid.localeCompare(children[j].id, {}, { sensitivity: "base" }) == 0) {
                    children[j].classList.replace('btn-outline-primary', 'btn-primary');

                } else {
                    children[j].classList.replace('btn-primary', 'btn-outline-primary');
                }
            }
        }
    }


    //Update Instruction Statement and Controls for Display
    update_instruction_statements_for_edit(id_instruct) {
        //'use strict';



        let i = this.instruction_gp[id_instruct].id_view;

        //Update Instruction for Edit
        document.getElementById('instruction_title').value = this.instruction_gp[id_instruct].title;
        document.getElementById('instruction_id_view').value = this.instruction_gp[id_instruct].id_view;
        document.getElementById('instruction_short_description').textContent = this.instruction_gp[id_instruct].short_description;
        document.getElementById('instruction_id_article').value = this.instruction_gp[id_instruct].id_article;
        document.getElementById('instruction_id_instruct').value = this.instruction_gp[id_instruct].id_instruct;
        document.getElementById('instruction_display_order').value = this.instruction_gp[id_instruct].display_order;
        document.getElementById('instruction_memo').value = this.instruction_gp[id_instruct].memo;
        document.getElementById('instruction_short_description_length').innerHTML = '(' + this.instruction_gp[id_instruct].short_description.length + ')';


        //Update Instruction for Delete
        document.getElementById('instruction_id_article_delete').value = this.instruction_gp[id_instruct].id_article;
        document.getElementById('instruction_id_instruct_delete').value = this.instruction_gp[id_instruct].id_instruct;



        //Update View for Edit
        document.getElementById('view_id_article').value = this.view_object[i].id_article;
        document.getElementById('view_id_view').value = this.view_object[i].id_view;
        document.getElementById('view_title').value = this.view_object[i].title;


    }


    //通常の、orbit control有効状態でのレンダリング
    render_orbital() {

        if (this.is_edit_mode) {
            this.update_viewinfo();
        }
        //if (!orbit_active) { return; }
        requestAnimationFrame(this.render_orbital.bind(this));


        controls.update();
        renderer.render(scene, camera_main);
    }


    //ビュー情報を更新する
    update_viewinfo() {


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



}