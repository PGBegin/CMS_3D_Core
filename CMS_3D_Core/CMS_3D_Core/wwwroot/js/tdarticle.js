



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

class Annotation {
    constructor(id_article, id_annotation, title, description1, description2, pos_x, pos_y, pos_z, web_id_annotation) {
        this.id_article = id_article;
        this.id_annotation = id_annotation;

        this.title = title;
        this.description1 = description1;
        this.description2 = description2;

        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.pos_z = pos_z;
        this.web_id_annotation = web_id_annotation;
    }
}




class AnnotationDisplay {
    constructor(id_article, id_instruct, id_annotation, is_display) {
        this.id_article = id_article;
        this.id_instruct = id_instruct;
        this.id_annotation = id_annotation;
        this.is_display = is_display;
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
        this.annotation = [];
        this.annotation_display = [];

        this.str_url_partapi_base = "/ContentsOperatorApis/GetPartObjectFile?";
        this.str_url_annotation_base = "/ContentsOperatorApis/GetAnnotationObjectList?";
        this.str_url_annotation_display_base = "/ContentsOperatorApis/GetAnnotationDisplayObjectList?";

        this.id_article = 0;

        //this.orbit_active = true;

        //var scene = new THREE.Scene();

        //this.camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
        //this.controls = new THREE.OrbitControls(this.camera_main, renderer.domElement);

        this.id_instruction_controlpanel = "control_panel_zone";
        this.id_viewpoint_controlpanel = "id_view_operation_panel";

        this.counter = 0;
        this.step = 75;

        this.pitch_px = 0;
        this.pitch_py = 0;
        this.pitch_pz = 0;

        this.pitch_tx = 0;
        this.pitch_ty = 0;
        this.pitch_tz = 0;

        this.is_edit_mode = true;

        this.orbit_active = false;


        this.camera_main;
        this.controls;
        this.scene = new THREE.Scene();

        this.gridHelper;
        this.axisHelper;
        this.lightHelper;

        this.light;
        this.ambient;
        this.renderer;
    }




    startup(lint, lpx, lpy, lpz, anbint, _gammaOutput, str_url_prodobjectapi, id_startinst) {

        //指定urlからデータを取得
        fetch(str_url_prodobjectapi)
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ

                //JSONのデータを各オブジェクトに詰め替える
                this.data_import(data);

                //コントロールパネル領域を生成する
                this.setup_control_panel_zone();

                //Op Panel
                this.setup_view_operation_panel();

                //Loading Annotations
                this.setup_annotations();

                this.setup_annotation_display();

                //データモデルを取得する
                //this.setup_instance_part_model(glfLoader, this.scene);
                this.setup_instance_part_model();

                //表示領域を初期化する
                this.initial_optional01();


                this.initial_setup_and_render(lint, lpx, lpy, lpz, anbint, _gammaOutput);


                //this.transition_instruction(1);

                if (id_startinst == 0) {

                    this.camera_main.position.x = 30;
                    this.camera_main.position.y = 30;
                    this.camera_main.position.z = 30;


                    this.controls.target.x = 0;
                    this.controls.target.y = 0;
                    this.controls.target.z = 0;
                }
                else {
                    this.transition_instruction(id_startinst);

                }

                //orbitコントロールモードを有効にし、レンダリングを開始する
                this.orbit_active = true;

                this.render_orbital();
                //render_orbital();

            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });
    }





    //Loading Basic Data
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


    //Loading Models
    setup_instance_part_model() {

        const glfLoader = new THREE.GLTFLoader();
        let str_url_partapi = "";
        //console.log(this.str_url_partapi_base);

        let x = this.str_url_partapi_base;
        let scene = this.scene;

        this.instance_part.forEach(function (element) {
            str_url_partapi = x + new URLSearchParams({ id_part: element.id_part }).toString();
            //console.log(str_url_partapi);

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

    //Loading Annotations
    setup_annotations() {

        let str_url_partapi = this.str_url_annotation_base + new URLSearchParams({ id_article: this.id_article }).toString();

        //指定urlからデータを取得
        fetch(str_url_partapi)
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ


                let div_annotations = document.getElementById('annotations');
                let temp_annotation;

                for (let i in data) {
                    this.annotation[data[i].id_annotation] = new Annotation(

                        data[i].id_article,
                        data[i].id_annotation,
                        data[i].title,

                        data[i].description1,
                        data[i].description2,

                        data[i].pos_x,
                        data[i].pos_y,
                        data[i].pos_z,
                        'id_annotation_' + data[i].id_annotation
                    );
                    //console.log(data[i].id_annotation);



                    //Create Annotation Html Element
                    temp_annotation = document.createElement('div');

                    //temp_annotation.id = 'id_annotation_' + this.annotation[data[i].id_annotation].id_annotation;
                    temp_annotation.id = this.annotation[data[i].id_annotation].web_id_annotation;


                    temp_annotation.classList.add('annotation');
                    temp_annotation.innerHTML = this.annotation[data[i].id_annotation].description1;
                    div_annotations.appendChild(temp_annotation);


                }

            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });
    }





    //Loading Annotation Display
    setup_annotation_display() {

        let str_url_api = this.str_url_annotation_display_base + new URLSearchParams({ id_article: this.id_article }).toString();

        const obj = this;
        const _id_article = this.id_article;
        //指定urlからデータを取得
        fetch(str_url_api)
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ
                let i, j;
                obj.instruction_gp.forEach(function (element) {
                    //i = 0;
                    i = element.id_instruct;
                    obj.annotation_display[i] = [];
                    obj.annotation.forEach(function (element) {
                        j = element.id_annotation;
                        obj.annotation_display[i][j] = new AnnotationDisplay(
                            _id_article,
                            i,
                            j,
                            false
                        );
                    });
                });

                for (let k in data) {
                    obj.annotation_display[data[k].id_instruct][data[k].id_annotation].is_display = true;
                }
            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });
    }

    //コントロールパネル領域を生成する
    setup_control_panel_zone() {

        let pn = document.getElementById(this.id_instruction_controlpanel);
        let temp_bt;
        let obj = this;
        this.instruction_gp.forEach( function (element) {

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            //temp_bt.onclick = transition_instruction2.bind(null, element.id_instruct);
            temp_bt.onclick = obj.transition_instruction.bind(obj, element.id_instruct);
            temp_bt.id = "btn_inst" + element.id_instruct;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = element.title;

            pn.appendChild(temp_bt);
        });
    }

    //setup view operation panel
    //id_viewpoint_controlpanel
    setup_view_operation_panel() {

        let pn = document.getElementById(this.id_viewpoint_controlpanel);
        if (pn != null) {
            let temp_bt;
        
            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.transition_view.bind(this, new THREE.Vector3(10, 0, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-XF";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.transition_view.bind(this, new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-XR";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.transition_view.bind(this, new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-YF";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.transition_view.bind(this, new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-YR";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.transition_view.bind(this, new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-ZF";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.transition_view.bind(this, new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-ZR";
            pn.appendChild(temp_bt);
        }
    }


    //表示関連を初期化する
    initial_optional01() {
        'use strict';


        //helper

        this.gridHelper = new THREE.GridHelper(200, 50);
        this.scene.add(this.gridHelper);


        this.axisHelper = new THREE.AxisHelper(1000);
        this.scene.add(this.axisHelper);


        //lightHelper = new THREE.DirectionalLightHelper(light, 20);
        //scene.add(lightHelper);
    }

    //表示関連を初期化する
    initial_setup_and_render(lint, lpx, lpy, lpz, anbint, _gammaOutput) {

        // light
        this.light = new THREE.DirectionalLight(0xffffff, lint);
        this.light.position.set(lpx, lpy, lpz);
        this.scene.add(this.light);



        this.ambient = new THREE.AmbientLight(0x404040, anbint);
        this.scene.add(this.ambient);

        // main camara
        this.camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);

        // renderer
        //renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#model_screen'), antialias: true
        });

        this.renderer.setSize(this.width, this.height);
        //renderer.setSize(500, 500);
        this.renderer.setClearColor(0xefefef);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        //document.getElementById('model_screen').appendChild(renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera_main, this.renderer.domElement);



        this.camera_main.position.x = 10;
        this.camera_main.position.y = 10;
        this.camera_main.position.z = 10;

        this.controls.target.x = 0;
        this.controls.target.y = 0;
        this.controls.target.z = 0;


        //ガンマ値をtrueに。
        //(truee.jsで一部のアイテムが暗くなるのを軽減)
        this.renderer.gammaOutput = _gammaOutput;

    }

    //指定した座標に遷移する関数
    transition_view(cam_pos, target) {

        
        this.counter = 0;
        this.step = 75;

        this.pitch_px = (cam_pos.x - this.camera_main.position.x) / this.step;
        this.pitch_py = (cam_pos.y - this.camera_main.position.y) / this.step;
        this.pitch_pz = (cam_pos.z - this.camera_main.position.z) / this.step;

        this.pitch_tx = (target.x - this.controls.target.x) / this.step;
        this.pitch_ty = (target.y - this.controls.target.y) / this.step;
        this.pitch_tz = (target.z - this.controls.target.z) / this.step;


        if (this.counter >= this.step) { return; }

        this.counter = this.counter + 1;
        this.camera_main.position.x += this.pitch_px;
        this.camera_main.position.y += this.pitch_py;
        this.camera_main.position.z += this.pitch_pz;


        this.controls.target.x += this.pitch_tx;
        this.controls.target.y += this.pitch_ty;
        this.controls.target.z += this.pitch_tz;

        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);

        requestAnimationFrame(this.render_trans.bind(this));


        if (this.is_edit_mode) {
            this.update_viewinfo();
        }
    }




    //指定されたIDのインストラクションに遷移する関数
    transition_instruction(id_instruct) {


        this.orbit_active = false;

        //カメラ位置の変更
        //---------------------
        let i = this.instruction_gp[id_instruct].id_view;


        // 視点のアニメーションによる移行
        // ------------------------------------------------------------------------------------------------

        this.counter = 0;
        this.step = 75;

        this.pitch_px = (this.view_object[i].cam_pos_x - this.camera_main.position.x) / this.step;
        this.pitch_py = (this.view_object[i].cam_pos_y - this.camera_main.position.y) / this.step;
        this.pitch_pz = (this.view_object[i].cam_pos_z - this.camera_main.position.z) / this.step;

        this.pitch_tx = (this.view_object[i].obt_target_x - this.controls.target.x) / this.step;
        this.pitch_ty = (this.view_object[i].obt_target_y - this.controls.target.y) / this.step;
        this.pitch_tz = (this.view_object[i].obt_target_z - this.controls.target.z) / this.step;


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
        this.camera_main.position.x += this.pitch_px;
        this.camera_main.position.y += this.pitch_py;
        this.camera_main.position.z += this.pitch_pz;


        this.controls.target.x += this.pitch_tx;
        this.controls.target.y += this.pitch_ty;
        this.controls.target.z += this.pitch_tz;

        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);

        requestAnimationFrame(this.render_trans.bind(this));


        if (this.is_edit_mode) {
            this.update_viewinfo();
        }
    }

    //Update Instruction Statement and buttuns for Display
    update_instruction_statements_for_view(id_instruct) {
        let i = this.instruction_gp[id_instruct].id_view;

        //console.log(window.innerWidth);

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
        //if (!this.orbit_active) { return; }
        requestAnimationFrame(this.render_orbital.bind(this));


        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);
        this.update_annotation_position();
    }


    //ビュー情報を更新する
    update_viewinfo() {


        document.getElementById('cam_pos_x').value = Math.floor(this.camera_main.position.x * 100) / 100;
        document.getElementById('cam_pos_y').value = Math.floor(this.camera_main.position.y * 100) / 100;
        document.getElementById('cam_pos_z').value = Math.floor(this.camera_main.position.z * 100) / 100;

        document.getElementById('cam_lookat_x').value = 0;
        document.getElementById('cam_lookat_y').value = 0;
        document.getElementById('cam_lookat_z').value = 0;

        document.getElementById('cam_quat_x').value = Math.floor(this.camera_main.quaternion.x * 1000) / 1000;
        document.getElementById('cam_quat_y').value = Math.floor(this.camera_main.quaternion.y * 1000) / 1000;
        document.getElementById('cam_quat_z').value = Math.floor(this.camera_main.quaternion.z * 1000) / 1000;
        document.getElementById('cam_quat_w').value = Math.floor(this.camera_main.quaternion.w * 1000) / 1000;

        document.getElementById('obt_target_x').value = Math.floor(this.controls.target.x * 100) / 100;
        document.getElementById('obt_target_y').value = Math.floor(this.controls.target.y * 100) / 100;
        document.getElementById('obt_target_z').value = Math.floor(this.controls.target.z * 100) / 100;

    }
    //Update Annotation Position
    update_annotation_position() {


        let web_annotation;
        const canvas = this.renderer.domElement;
        const cm = this.camera_main;

        let ofx = document.getElementById('model_screen').getBoundingClientRect().left;
        let ofy = document.getElementById('model_screen').getBoundingClientRect().top;
        //console.log("ofx:" + ofx + ",ofy:" + ofy);

        this.annotation.forEach(function (element) {

            const vector = new THREE.Vector3(element.pos_x, element.pos_y, element.pos_z);
            vector.project(cm);


            vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
            vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

            vector.x = vector.x + ofx + pageXOffset;
            vector.y = vector.y + ofy + pageYOffset;

            web_annotation = document.getElementById(element.web_id_annotation);
            web_annotation.style.top = `${vector.y}px`;
            web_annotation.style.left = `${vector.x}px`;

        });

    }


}

//TDArticleここまで
//---------------------------------------------------------------------------
//通常の、orbit control有効状態でのレンダリング
