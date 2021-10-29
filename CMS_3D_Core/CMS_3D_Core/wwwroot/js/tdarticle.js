






class Aarticle {
    constructor(id_article, id_assy, title, short_description, long_description, meta_description, meta_category, status
        , directional_light_color,  directional_light_intensity, directional_light_px, directional_light_py, directional_light_pz
        , ambient_light_color, ambient_light_intensity, gammaOutput, id_attachment_for_eye_catch) {

        this.id_article = id_article;
        this.id_assy = id_assy;

        this.title = title;
        this.short_description = short_description;
        this.long_description = long_description;
        this.meta_description = meta_description;
        this.meta_category = meta_category;

        this.status = status;

        this.directional_light_color = directional_light_color;
        this.directional_light_intensity = directional_light_intensity;
        this.directional_light_px = directional_light_px;
        this.directional_light_py = directional_light_py;
        this.directional_light_pz = directional_light_pz;

        this.ambient_light_color = ambient_light_color;
        this.ambient_light_intensity = ambient_light_intensity;
        this.gammaOutput = gammaOutput;

        this.id_attachment_for_eye_catch = id_attachment_for_eye_catch
    }
}

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
    constructor(id_article, id_annotation, title, description1, description2, status, pos_x, pos_y, pos_z, web_id_annotation) {
        this.id_article = id_article;
        this.id_annotation = id_annotation;

        this.title = title;
        this.description1 = description1;
        this.description2 = description2;
        this.status = status;

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

    constructor() {

        //Screen Size
        this.width = 720;
        this.height = 405;

        //API URL Base
        this.str_url_partapi_base = "/ContentsOperatorApis/GetPartObjectFile?";
        this.str_url_annotation_base = "/ContentsOperatorApis/GetAnnotationObjectList?";
        this.str_url_annotation_display_base = "/ContentsOperatorApis/GetAnnotationDisplayObjectList?";

        this.str_url_base_prodobjectapi_articlemode = "/ContentsOperatorApis/GetAssemblyObjectList?";

        this.str_url_base_prodobjectapi_assymode = "/ContentsOperatorApis/GetAssemblyObjectListOnlyInstance?";


        this.str_url_base_article = "/ContentsOperatorApis/GetArticleObject?";

        //Model Objects
        this.article;
        this.view_object = [];
        this.instruction_gp = [];
        this.instance_part = [];
        this.annotation = [];
        this.annotation_display = [];


        this.camera_main;
        this.controls;
        this.scene = new THREE.Scene();

        this.gridHelper;
        this.axisHelper;
        this.lightHelper;

        this.light;
        this.ambient;
        this.renderer;


        this.id_article = 0;
        this.id_startinst = 0;
        this.id_assy = 0;

        this.camera_main_startpos = new THREE.Vector3(30, 30, 30);
        this.controls_target_startpos = new THREE.Vector3(0, 0, 0);




        //Element Names for HTML TAGS
        this.idhead_edit_annotation_display = "id_edit_annotation_display_";

        this.id_instruction_controlpanel = "control_panel_zone";
        this.id_edit_annotation_selection_panels = "edit_annotation_selection_panels";
        this.id_edit_annotation_position_panels = "edit_annotation_position_panels";
        this.id_viewpoint_controlpanel = "id_view_operation_panel";


        // Parameter for View Transition
        this.counter = 0;
        this.step = 75;

        this.pitch_px = 0;
        this.pitch_py = 0;
        this.pitch_pz = 0;

        this.pitch_tx = 0;
        this.pitch_ty = 0;
        this.pitch_tz = 0;

        this.orbit_active = false;


        // Operation Mode
        this.is_edit_mode = true;
        this.is_display_helper = false;
        this.is_mode_assy = false;

        // 1 : landscape, 0:Portrait 
        this.orientation_mode = 1;

    }



    //onWindowResize
    onWindowResize() {
        //1.画面サイズを測定し、モードを判定する
        //0:縦モード、1:横モード


        if (this.is_edit_mode) {

            this.width = 0.95 * document.documentElement.clientWidth / 2;
            this.height = this.width * 9 / 16;

            document.getElementById('id_contents_models').setAttribute("class", "");
            document.getElementById('id_contents_instructions').setAttribute("class", "");
            document.getElementById('id_contents_models').classList.add('col-6');
            document.getElementById('id_contents_instructions').classList.add('col-6');
        } else {

            // chk displaymode
            if (document.documentElement.clientWidth / document.documentElement.clientHeight > 1) {
                this.orientation_mode = 1;
            } else {
                this.orientation_mode = 0;
            }

            if (this.orientation_mode == 1) {
                document.getElementById('id_contents_models').setAttribute("class", "");
                document.getElementById('id_contents_instructions').setAttribute("class", "");
                this.width = 0.95 * document.documentElement.clientWidth / 2;
                this.height = this.width * 9 / 16;
                document.getElementById('id_contents_models').classList.add('col-6');
                document.getElementById('id_contents_instructions').classList.add('col-6');
            } else {
                document.getElementById('id_contents_models').setAttribute("class", "");
                document.getElementById('id_contents_instructions').setAttribute("class", "");
                this.width = 0.95 * document.documentElement.clientWidth;
                this.height = this.width * 9 / 16;
                document.getElementById('id_contents_models').classList.add('col-12');
                document.getElementById('id_contents_instructions').classList.add('col-12');

            }

            document.getElementById('preview_instruction_short_description').style.height =
                document.documentElement.clientHeight - document.getElementById('preview_instruction_short_description').getBoundingClientRect().top + 'px';

        }


        this.camera_main.aspect = this.width / this.height;
        this.camera_main.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);

    }


    //Setup
    startup() {



        this.setup_article().then(function (value) {

            let str_url_api = this.str_url_base_prodobjectapi_articlemode + new URLSearchParams({ id_article: this.id_article }).toString();


            if (this.is_mode_assy) {
                str_url_api = this.str_url_base_prodobjectapi_assymode + new URLSearchParams({ id_assy: this.id_assy }).toString();
            }

            //指定urlからデータを取得
            fetch(str_url_api)
                .then(response => {

                    return response.json();

                })
                .then(data => { // 処理が成功した場合に取得されるJSONデータ

                    //JSONのデータを各オブジェクトに詰め替える
                    this.data_import(data);

                    //コントロールパネル領域を生成する
                    this.setup_control_panel_zone();

                    //setup view operation panel
                    this.setup_view_operation_panel();

                    //Loading Annotations

                    this.setup_annotations().then(function (value) {

                        //Loading Annotation Display
                        this.setup_annotation_display().then(function (value) {

                            //console.log('value:' + value);

                            //表示領域を初期化する
                            this.initial_optional01();

                            //Initialize render
                            this.initial_setup_and_render(
                                this.article.directional_light_intensity
                                , this.article.directional_light_px, this.article.directional_light_py, this.article.directional_light_pz
                                , this.article.ambient_light_intensity
                                , this.article.gammaOutput);


                            //データモデルを取得する
                            this.setup_instance_part_model();



                            if (this.id_startinst == 0) {


                                this.camera_main.position.copy(this.camera_main_startpos);


                                this.controls.target.copy(this.controls_target_startpos);
                            }
                            else {
                                this.transition_instruction(this.id_startinst);

                            }

                            this.onWindowResize();

                            //orbitコントロールモードを有効にし、レンダリングを開始する
                            this.orbit_active = true;

                            this.render_orbital();

                        }.bind(this))

                    }.bind(this));

                })
                .catch(error => { // エラーの場合の処理

                    console.log(error);

                });
        }.bind(this));

        //this.onWindowResize();
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

    //Loading Article
    async setup_article() {

        if (this.id_article != 0) {
            let str_url_api = this.str_url_base_article + new URLSearchParams({ id_article: this.id_article }).toString();

            //指定urlからデータを取得
            return fetch(str_url_api)
                .then(response => {

                    return response.json();

                })
                .then(data => { // 処理が成功した場合に取得されるJSONデータ
                    this.article = new Aarticle(data.id_article, data.id_assy, data.title, data.short_description, data.long_description, data.meta_description, data.meta_category, data.status
                        , data.directional_light_color, data.directional_light_intensity, data.directional_light_px, data.directional_light_py, data.directional_light_pz
                        , data.ambient_light_color, data.ambient_light_intensity, data.gammaOutput, data.id_attachment_for_eye_catch);


                })
                .catch(error => { // エラーの場合の処理

                    console.log(error);

                });

        } else {
            this.article = new Aarticle(0, 0, "No Article", "", "", "", "", 0
                , 1 //data.directional_light_color
                , 1 //data.directional_light_intensity
                , 30 //data.directional_light_px
                , 30 //data.directional_light_py
                , 30 //data.directional_light_pz
                , 1 //data.ambient_light_color
                , 1 //data.ambient_light_intensity
                , true //data.gammaOutput
                , 0 //data.id_attachment_for_eye_catch
            );

            return Promise.resolve();
        }
    }

    //Loading Models
    setup_instance_part_model() {

        const glfLoader = new THREE.GLTFLoader();
        //console.log(this.str_url_partapi_base);

        let scene = this.scene;

        this.instance_part.forEach(function (element) {
            let str_url_partapi = this.str_url_partapi_base + new URLSearchParams({ id_part: element.id_part }).toString();
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
        }.bind(this));
    }

    //Loading Annotations
    async setup_annotations() {

        let str_url_partapi = this.str_url_annotation_base + new URLSearchParams({ id_article: this.id_article }).toString();

        //指定urlからデータを取得
        return fetch(str_url_partapi)
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ


                let div_annotations = document.getElementById('annotations');
                let temp_annotation;
                let title_annotation;
                let description1_annotation;

                for (let i in data) {
                    this.annotation[data[i].id_annotation] = new Annotation(

                        data[i].id_article,
                        data[i].id_annotation,
                        data[i].title,

                        data[i].description1,
                        data[i].description2,

                        data[i].status,

                        data[i].pos_x,
                        data[i].pos_y,
                        data[i].pos_z,
                        'id_annotation_' + data[i].id_annotation
                    );
                    //console.log(data[i].id_annotation);



                    //Create Annotation Html Element
                    temp_annotation = document.createElement('div');


                    temp_annotation.id = this.annotation[data[i].id_annotation].web_id_annotation;


                    temp_annotation.classList.add('annotation');


                    title_annotation = document.createElement('p');
                    description1_annotation = document.createElement('p');


                    title_annotation.innerHTML = this.annotation[data[i].id_annotation].title;
                    description1_annotation.innerHTML = this.annotation[data[i].id_annotation].description1;
                    temp_annotation.appendChild(title_annotation);
                    temp_annotation.appendChild(description1_annotation);
                    div_annotations.appendChild(temp_annotation);


                }


                //Create Edit Annotation Selection Panels
                this.setup_edit_annotation_selection_panels();

                //Create Edit Annotation Position Panels
                this.setup_edit_annotation_position_panels();



            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });
    }





    //Loading Annotation Display
    async setup_annotation_display() {

        let str_url_api = this.str_url_annotation_display_base + new URLSearchParams({ id_article: this.id_article }).toString();

        //指定urlからデータを取得
        return fetch(str_url_api)
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ
                let i, j;
                this.instruction_gp.forEach(function (element) {
                    //i = 0;
                    i = element.id_instruct;
                    this.annotation_display[i] = [];
                    this.annotation.forEach(function (element) {
                        j = element.id_annotation;
                        this.annotation_display[i][j] = new AnnotationDisplay(
                            this.id_article,
                            i,
                            j,
                            false
                        );
                    }.bind(this));
                }.bind(this));

                for (let k in data) {
                    this.annotation_display[data[k].id_instruct][data[k].id_annotation].is_display = data[k].is_display;
                    console.log(data[k].is_display);
                }
            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });
    }


    //Create Instruction Select Panels
    setup_control_panel_zone() {

        let pn = document.getElementById(this.id_instruction_controlpanel);
        let temp_bt;
        //let obj = this;
        this.instruction_gp.forEach( function (element) {

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            //temp_bt.onclick = transition_instruction2.bind(null, element.id_instruct);
            temp_bt.onclick = this.transition_instruction.bind(this, element.id_instruct);
            temp_bt.id = "btn_inst" + element.id_instruct;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = element.title;

            pn.appendChild(temp_bt);
        }.bind(this));
    }

    //Create Edit Annotation Selection Panels
    setup_edit_annotation_selection_panels() {

        let pn = document.getElementById(this.id_edit_annotation_selection_panels);

        if (pn != null) {
            let temp_bt;
            //let obj = this;
            this.annotation.forEach(function (element) {

                temp_bt = document.createElement('button');
                temp_bt.type = 'button';
                temp_bt.onclick = this.transition_annotation.bind(this, element.id_annotation);
                temp_bt.id = "btn_annotation" + element.id_annotation;
                temp_bt.classList.add('btn');
                temp_bt.classList.add('btn-outline-primary');
                temp_bt.textContent = element.title;

                pn.appendChild(temp_bt);
            }.bind(this));
        }
    }


    //Create Edit Annotation Selection Panels
    setup_edit_annotation_position_panels() {

        let pn = document.getElementById(this.id_edit_annotation_position_panels);

        if (pn != null) {
            let temp_bt;
            //let obj = this;

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, -1, 0, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:-1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, -0.1, 0, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:-0.1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0.1, 0, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:+0.1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 1, 0, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:+1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('br');
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, -1, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:-1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, -0.1, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:-0.1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, 0.1, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:+0.1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, 1, 0);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:+1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('br');
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0,  0, -1);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:-1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, 0, -0.1);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:-0.1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, 0, 0.1);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:+0.1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.set_annotation_position_relative.bind(this, 0, 0, 1);
            //temp_bt.id = "btn_annotation" + element.id_annotation;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:+1";
            pn.appendChild(temp_bt);

        }
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

        this.gridHelper.visible = this.is_display_helper;
        this.axisHelper.visible = this.is_display_helper;

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


        this.onWindowResize();

    }

    //指定した座標に遷移する関数
    transition_view(cam_pos, target) {

        
        this.counter = 0;
        //this.step = 75;

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


    //Cng Annotation for Edit Window
    transition_annotation(id_annotation) {

        if (this.is_edit_mode) {

            //Edit
            document.getElementById('id_edit_annotation_input_id_annotation').value = this.annotation[id_annotation].id_annotation;
            document.getElementById('id_edit_annotation_input_title').value = this.annotation[id_annotation].title;

            document.getElementById('id_edit_annotation_input_description1').value = this.annotation[id_annotation].description1;
            document.getElementById('id_edit_annotation_input_description2').value = this.annotation[id_annotation].description2;

            document.getElementById('id_edit_annotation_input_status').value = this.annotation[id_annotation].status;


            document.getElementById('id_edit_annotation_input_pos_x').value = this.annotation[id_annotation].pos_x;
            document.getElementById('id_edit_annotation_input_pos_y').value = this.annotation[id_annotation].pos_y;
            document.getElementById('id_edit_annotation_input_pos_z').value = this.annotation[id_annotation].pos_z;

            //Delete
            document.getElementById('id_delete_annotation_input_id_annotation').value = this.annotation[id_annotation].id_annotation;
        }

    }

    //Cng Annotation for Edit Window
    set_annotation_position_relative(px, py, pz) {

        //Relative


        const id_annotation = document.getElementById('id_edit_annotation_input_id_annotation').value;

        if (this.is_edit_mode) {

            //Edit
            this.annotation[id_annotation].pos_x += px;
            this.annotation[id_annotation].pos_y += py;
            this.annotation[id_annotation].pos_z += pz;


            document.getElementById('id_edit_annotation_input_pos_x').value = this.annotation[id_annotation].pos_x;
            document.getElementById('id_edit_annotation_input_pos_y').value = this.annotation[id_annotation].pos_y;
            document.getElementById('id_edit_annotation_input_pos_z').value = this.annotation[id_annotation].pos_z;

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

        this.update_annotation_display(id_instruct);
    }

    //Update Annotation Display
    update_annotation_display(id_instruct) {
        //let obj = this;
        console.log('called');
        this.annotation.forEach(function (element) {
            document.getElementById(this.annotation[element.id_annotation].web_id_annotation).hidden = !this.annotation_display[id_instruct][element.id_annotation].is_display;
        }.bind(this));
    }

    //視点変更(移動部分)
    render_trans() {

        //update_viewinfo();
        if (this.counter >= this.step) { return; }

        this.counter += 1;

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

        //↓ Ref
        //https://qiita.com/diescake/items/70d9b0cbd4e3d5cc6fce
        //let obj = this.annotation_display;

        this.annotation.forEach(function (element) {
            document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_id_instruct').value = this[id_instruct][element.id_annotation].id_instruct;
            document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_is_display').checked = this[id_instruct][element.id_annotation].is_display;
        }.bind(this.annotation_display));



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