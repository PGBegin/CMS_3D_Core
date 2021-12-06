import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { marked } from 'marked';





class Aarticle {
    constructor(id_article, id_assy, title, short_description, long_description, meta_description, meta_category, status
        , directional_light_color, directional_light_intensity, directional_light_px, directional_light_py, directional_light_pz
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
        this.marker = null;
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




class Refelencematerial {
    constructor(id_assy, id_inst, id_part, model_name, file_name, file_length, itemlink, author, license) {
        this.id_assy = id_assy;
        this.id_inst = id_inst;
        this.id_part = id_part;
        this.model_name = model_name;
        this.file_name = file_name;
        this.file_length = file_length;
        this.itemlink = itemlink;
        this.author = author;
        this.license = license;
    }

}



//---------------------------------------------------------------------------
class TDArticle {

    constructor() {

        //Screen Size
        this.width = 720;
        this.height = 405;

        //API URL Base
        this.str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";

        this.str_url_base_prodobjectapi_articlemode = "/ContentsOperatorForArticleApis/GetArticleObjectWholeData?";

        this.str_url_base_prodobjectapi_assymode = "/ContentsOperatorForArticleApis/GetAssemblyObjectListOnlyInstance?";


        //Ajax DB Update Apis
        this.str_url_base_edit_product_instruction = "/ContentsOperatorForArticleApis/EditProductInstructionApi";
        this.str_url_base_delete_product_instruction = "/ContentsOperatorForArticleApis/DeleteProductInstructionApi";

        this.str_url_base_edit_product_view = "/ContentsOperatorForArticleApis/EditProductViewApi";
        this.str_url_base_delete_product_view = "/ContentsOperatorForArticleApis/DeleteProductViewApi";

        this.str_url_base_edit_product_annotation = "/ContentsOperatorForArticleApis/EditProductAnnotationApi";
        this.str_url_base_delete_product_annotation = "/ContentsOperatorForArticleApis/DeleteProductAnnotationApi";

        this.str_url_base_edit_product_annotation_display = "/ContentsOperatorForArticleApis/EditProductAnnotationDisplayApi";



        //Model Objects
        this.article;
        this.view_object = [];
        this.instruction_gp = [];
        this.instance_part = [];
        this.annotation = [];
        this.annotation_display = [];

        this.refelencematerial = [];

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


        //
        this.selected_instruction = 0;
        this.selected_view = 0;
        this.selected_annotation = 0;

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

    //
    async ObjSetupAllObjectsWithoutInstanceModelFromDb() {


        let str_url_api = this.str_url_base_prodobjectapi_articlemode + new URLSearchParams({ id_article: this.id_article }).toString();


        //cors対策追加
        //指定urlからデータを取得
        return fetch(str_url_api, { mode: 'cors' })
            .then(response => {

                return response.json();

            })
            .then(data => { // 処理が成功した場合に取得されるJSONデータ
                //console.log(data);
                this.ObjSetupAllObjectsWithoutInstanceModelFromJson(data);

                //return Promise.resolve();
            });

    }

    //Setup Json
    ObjSetupAllObjectsWithoutInstanceModelFromJson(data) {


        this.view_object.length = 0;
        this.instruction_gp.length = 0;
        this.instance_part.length = 0;
        this.annotation.length = 0;
        this.annotation_display.length = 0;

        for (let i in data) {

            if (data[i].type == "article") {
                // 処理が成功した場合に取得されるJSONデータ
                this.article = new Aarticle(
                    data[i].id_article,
                    data[i].id_assy,
                    data[i].title,
                    data[i].short_description,
                    data[i].long_description,
                    data[i].meta_description,
                    data[i].meta_category,
                    data[i].status,
                    data[i].directional_light_color,
                    data[i].directional_light_intensity,
                    data[i].directional_light_px,
                    data[i].directional_light_py,
                    data[i].directional_light_pz,
                    data[i].ambient_light_color,
                    data[i].ambient_light_intensity,
                    data[i].gammaOutput,
                    data[i].id_attachment_for_eye_catch);
            }

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


            if (data[i].type == "annotation") {
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
            }


            if (data[i].type == "refelencematerial") {
                this.refelencematerial[i] = new Refelencematerial(
                    data[i].id_assy,
                    data[i].id_inst,
                    data[i].id_part,
                    data[i].model_name,
                    data[i].file_name,
                    data[i].file_length,
                    data[i].itemlink,
                    data[i].author,
                    data[i].license
                );
            }

        }


        this.instruction_gp.forEach(function (element) {
            //i = 0;
            let i;
            let j;
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



        for (let i in data) {

            if (data[i].type == "annotation_display") {
                this.annotation_display[data[i].id_instruct][data[i].id_annotation].is_display = data[i].is_display;
                //console.log(data[i].is_display);
            }

        }




        const ar1_map = (this.instruction_gp.filter(x => typeof x.display_order === 'number')).map(x => x.display_order);


        this.id_startinst = this.instruction_gp.filter(x => x.display_order == Math.min.apply(null, ar1_map))[0].id_instruct;

        //console.log(this.id_startinst);

    }

    //ReSetup
    ComplexResetEnvironment() {


        //Loading Article
        this.ObjSetupAarticleDefault();


        //Setup Instruction Selection Control Panels (for Display and Editor)
        this.DomSetupInstructionControler();


        //setup view operation panel
        //this.DomSetupLookingControler();

        //DomSetupViewListEditor
        this.DomSetupViewListEditor();


        //Create Edit Annotation Selection Panels
        this.DomSetupAnnotationEditorSelectControls();

        //Annotation Display Edit Panel
        this.DomSetupAnnotationDisplayEditor();

        //Loading Annotations
        this.DomSetupAnnotationScreen();

    }



    //Setup
    ComplexSetupEnvironmentInitial() {



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
                this.ObjSetupAllObjectsWithoutInstanceModelFromJson(data);


                //Loading Article
                this.ObjSetupAarticleDefault();


                //コントロールパネル領域を生成する
                this.DomSetupInstructionControler();

                //setup view operation panel
                this.DomSetupLookingControler();

                //DomSetupViewListEditor
                this.DomSetupViewListEditor();


                //Loading Annotations
                this.DomSetupAnnotationScreen();


                //Create Edit Annotation Selection Panels
                this.DomSetupAnnotationEditorSelectControls();

                //Create Edit Annotation Position Panels
                this.DomSetupAnnotationPositionEditButton();

                //Annotation Display Edit Panel
                this.DomSetupAnnotationDisplayEditor();

                //RefelencematerialView
                this.DomSetupRefelencematerialView();

                //表示領域を初期化する
                this.ComplexSetupRenderOptionalInitial();


                //Initialize render
                this.ComplexSetupRenderInitial(
                    this.article.directional_light_intensity
                    , this.article.directional_light_px, this.article.directional_light_py, this.article.directional_light_pz
                    , this.article.ambient_light_intensity
                    , this.article.gammaOutput);


                //データモデルを取得する
                this.ObjSetupInstancePartModelFromDb();


                if (this.id_startinst == 0) {

                    this.camera_main.position.copy(this.camera_main_startpos);

                    this.controls.target.copy(this.controls_target_startpos);
                }
                else {
                    this.ComplexTransitionInstruction(this.id_startinst);
                }

                if (this.is_edit_mode != true && this.is_mode_assy != true) {
                    this.onWindowResize();
                }


                //orbitコントロールモードを有効にし、レンダリングを開始する
                this.orbit_active = true;

                this.ScreenControlOrbital();


            })
            .catch(error => { // エラーの場合の処理

                console.log(error);

            });

        //this.onWindowResize();
    }




    //Loading Article
    ObjSetupAarticleDefault() {

        if (this.id_article == 0) {

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
        }
    }




    //Loading Models
    ObjSetupInstancePartModelFromDb() {

        const glfLoader = new GLTFLoader();

        let scene = this.scene;

        this.instance_part.forEach(function (element) {
            let str_url_partapi = this.str_url_partapi_base + new URLSearchParams({ id_part: element.id_part }).toString();

            glfLoader.load(str_url_partapi, function (gltf) {



                document.getElementById('div_progressbar_modeldl').setAttribute('hidden', '');
                scene.add(gltf.scene);

            }, function (xhr) {

                document.getElementById('progressbar_modeldl').setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

            }, function (error) {

                console.error(error);

            });
        }.bind(this));
    }



    //Loading Annotations
    DomSetupAnnotationScreen() {



        let div_annotations = document.getElementById('annotations');

        if (div_annotations != null) {

            let temp_annotation;
            let title_annotation;
            let description1_annotation;

            //console.log("setupannotation\n");
            console.log(div_annotations);

            while (div_annotations.firstChild) {
                div_annotations.removeChild(div_annotations.firstChild);
            }

            this.annotation.forEach(function (element) {


                temp_annotation = document.createElement('div');

                temp_annotation.id = element.web_id_annotation;

                temp_annotation.classList.add('annotation');

                title_annotation = document.createElement('p');
                description1_annotation = document.createElement('p');


                title_annotation.innerHTML = element.title;
                description1_annotation.innerHTML = element.description1;

                temp_annotation.appendChild(title_annotation);
                temp_annotation.appendChild(description1_annotation);
                div_annotations.appendChild(temp_annotation);


                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0XCD0000 });
                element.marker = new THREE.Mesh(geometry, material);
                element.marker.position.set(element.pos_x, element.pos_y, element.pos_z);
                this.scene.add(element.marker);



            }.bind(this));

        }
    }



    //Create Instruction Select Panels
    DomSetupInstructionControler() {

        let pn = document.getElementById(this.id_instruction_controlpanel);

        while (pn.firstChild) {
            pn.removeChild(pn.firstChild);
        }

        //console.log(this.instruction_gp);

        let temp_bt;

        this.instruction_gp.forEach(function (element) {


            //console.log("id:" + element.id_instruct);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ComplexTransitionInstruction.bind(this, element.id_instruct);
            temp_bt.id = "btn_inst" + element.id_instruct;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = element.title;

            pn.appendChild(temp_bt);

        }.bind(this));
    }

    //Create Edit Annotation Selection Panels
    DomSetupAnnotationEditorSelectControls() {

        let pn = document.getElementById(this.id_edit_annotation_selection_panels);

        if (pn != null) {
            while (pn.firstChild) {
                pn.removeChild(pn.firstChild);
            }
            let temp_bt;

            this.annotation.forEach(function (element) {

                temp_bt = document.createElement('button');
                temp_bt.type = 'button';
                temp_bt.onclick = this.DomUpdateAnnotationEditor.bind(this, element.id_annotation);
                temp_bt.id = "btn_annotation" + element.id_annotation;
                temp_bt.classList.add('btn');
                temp_bt.classList.add('btn-outline-primary');
                temp_bt.textContent = element.title;

                pn.appendChild(temp_bt);
            }.bind(this));
        }
    }

    //Create AnnotationDisplay Editor
    DomSetupAnnotationDisplayEditor() {

        //DomSetupAnnotationDisplayEditor
        this.id_edit_annotation_display_tbody = "id_edit_annotation_display_tbody";
        let tbody = document.getElementById(this.id_edit_annotation_display_tbody);


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr;
            let temp_td;
            let temp_ipt;
            let i = 0;

            this.annotation.forEach(function (element) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and Low No.)

                temp_td = document.createElement('td');

                temp_td.innerText = (i + 1).toString();


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + element.id_annotation + "]." + "id_edit_annotation_display_input_id_article";
                temp_ipt.name = "[" + i + "]." + "id_article";
                temp_ipt.type = "hidden";
                temp_ipt.value = element.id_article;

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + element.id_annotation + "]." + "id_edit_annotation_display_input_id_instruct";
                temp_ipt.name = "[" + i + "]." + "id_instruct";
                temp_ipt.type = "hidden";
                temp_ipt.value = element.id_instruct;

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + element.id_annotation + "]." + "id_edit_annotation_display_input_id_annotation";
                temp_ipt.name = "[" + i + "]." + "id_annotation";
                temp_ipt.type = "hidden";
                temp_ipt.value = element.id_annotation;

                temp_td.appendChild(temp_ipt);


                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = element.id_annotation;

                temp_tr.appendChild(temp_td);

                // Colomn 03 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = element.title;

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Annotation Discription)
                temp_td = document.createElement('td');

                temp_td.innerText = element.description1;

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Check box for Display)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + element.id_annotation + "]." + "id_edit_annotation_display_input_is_display";
                temp_ipt.name = "[" + i + "]." + "is_display";
                temp_ipt.type = "checkbox";
                temp_ipt.value = true;

                temp_td.appendChild(temp_ipt);


                temp_tr.appendChild(temp_td);

                tbody.appendChild(temp_tr);
                i += 1;
            }.bind(this));
        }
    }


    //Create AnnotationDisplay Editor
    DomSetupViewListEditor() {

        this.id_edit_list_view_tbody = "id_edit_list_view_tbody";
        let tbody = document.getElementById(this.id_edit_list_view_tbody);


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr;
            let temp_td;
            let temp_ipt;
            let temp_bt;
            let i = 0;


            //ID	title	X	Y	Z	REf	Delete
            this.view_object.forEach(function (element) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and ID No.)

                temp_td = document.createElement('td');

                temp_td.innerText = (i + 1).toString();


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + element.id_view + "]." + "id_edit_list_view_input_id_article";
                temp_ipt.name = "[" + i + "]." + "id_article";
                temp_ipt.type = "hidden";
                temp_ipt.value = element.id_article;

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + element.id_view + "]." + "id_edit_list_view_input_id_view";
                temp_ipt.name = "[" + i + "]." + "id_view";
                temp_ipt.type = "hidden";
                temp_ipt.value = element.id_view;

                temp_td.appendChild(temp_ipt);



                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = element.id_view;

                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = element.title;

                temp_tr.appendChild(temp_td);

                // Colomn 03 (Pos X)
                temp_td = document.createElement('td');

                temp_td.innerText = element.cam_pos_x;

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Pos Y)
                temp_td = document.createElement('td');

                temp_td.innerText = element.cam_pos_y;

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Pos Z)
                temp_td = document.createElement('td');

                temp_td.innerText = element.cam_pos_z;

                temp_tr.appendChild(temp_td);

                // Colomn 06 (REf)
                temp_td = document.createElement('td');


                let x = this.instruction_gp.filter(item => item.id_view === element.id_view);
                //console.log(x);

                x.forEach(function (element) {
                    temp_td.innerText = temp_td.innerText + "ID:" + element.id_instruct;
                    //temp_td.appendChild(temp_bt);
                });

                temp_tr.appendChild(temp_td);

                // Colomn 07 (Check box for Display)
                temp_td = document.createElement('td');


                temp_bt = document.createElement('button');
                temp_bt.type = 'button';
                temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(element.cam_pos_x, element.cam_pos_y, element.cam_pos_z), new THREE.Vector3(element.obt_target_x, element.obt_target_y, element.obt_target_z));
                temp_bt.classList.add('btn');
                temp_bt.classList.add('btn-primary');
                temp_bt.textContent = "Show";
                temp_td.appendChild(temp_bt);


                if (!this.instruction_gp.some(item => item.id_view === element.id_view)) {
                    temp_bt = document.createElement('button');
                    temp_bt.type = 'button';
                    temp_bt.onclick = this.DbDeleteView.bind(this, element.id_view);
                    temp_bt.classList.add('btn');
                    temp_bt.classList.add('btn-danger');
                    temp_bt.textContent = "Delete";
                    temp_td.appendChild(temp_bt);

                }


                temp_tr.appendChild(temp_td);

                tbody.appendChild(temp_tr);
                i += 1;
            }.bind(this));
        }
    }


    //Create Edit Annotation Selection Panels
    DomSetupAnnotationPositionEditButton() {

        let pn = document.getElementById(this.id_edit_annotation_position_panels);

        if (pn != null) {
            let temp_bt;

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, -1, 0, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:-1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, -0.1, 0, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:-0.1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0.1, 0, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:+0.1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 1, 0, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "X:+1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('br');
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, -1, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:-1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, -0.1, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:-0.1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, 0.1, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:+0.1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, 1, 0);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Y:+1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('br');
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, 0, -1);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:-1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, 0, -0.1);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:-0.1";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, 0, 0.1);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:+0.1";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomUpdateAnnotationPositionShift.bind(this, 0, 0, 1);
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-primary');
            temp_bt.textContent = "Z:+1";
            pn.appendChild(temp_bt);

        }
    }

    //setup view operation panel
    //id_viewpoint_controlpanel
    DomSetupLookingControler() {

        let pn = document.getElementById(this.id_viewpoint_controlpanel);
        if (pn != null) {
            let temp_bt;

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(10, 0, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-XF";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-XR";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(0, 10, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-YF";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-YR";
            pn.appendChild(temp_bt);


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-ZF";
            pn.appendChild(temp_bt);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 0));
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = "View-ZR";
            pn.appendChild(temp_bt);
        }
    }




    //Create Refelencematerial Viewer
    DomSetupRefelencematerialView() {

        //DomSetupAnnotationDisplayEditor
        this.id_view_refelencematerial_table_tbody = "id_view_refelencematerial_table_tbody";
        let tbody = document.getElementById(this.id_view_refelencematerial_table_tbody);


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr;
            let temp_td;
            let temp_a;
            let i = 0;

            this.refelencematerial.forEach(function (element) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and Low No.)

                temp_td = document.createElement('td');

                temp_td.innerText = element.model_name;

                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = element.file_name;

                temp_tr.appendChild(temp_td);

                // Colomn 03 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = element.file_length;

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Annotation Discription)
                temp_td = document.createElement('td');

                temp_a = document.createElement('a');

                temp_a.innerText = 'Data Source';

                temp_a.href = element.itemlink;

                temp_td.appendChild(temp_a);

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Check box for Display)
                temp_td = document.createElement('td');

                temp_td.innerText = element.author;

                temp_tr.appendChild(temp_td);

                // Colomn 06 (Check box for Display)
                temp_td = document.createElement('td');

                temp_td.innerText = element.license;

                temp_tr.appendChild(temp_td);

                tbody.appendChild(temp_tr);
                i += 1;

            }.bind(this));
        }
    }


    //Initialize Render Objects and Setting for Optional (Like Helpers)
    ComplexSetupRenderOptionalInitial() {
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

    //Initialize Render Objects and Setting for Optional (Like Helpers)
    ComplexSetupRenderInitial(lint, lpx, lpy, lpz, anbint, _gammaOutput) {

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
        this.renderer.setClearColor(0xefefef);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.controls = new OrbitControls(this.camera_main, this.renderer.domElement);



        this.camera_main.position.x = 10;
        this.camera_main.position.y = 10;
        this.camera_main.position.z = 10;

        this.controls.target.x = 0;
        this.controls.target.y = 0;
        this.controls.target.z = 0;


        //Setting gammaOutput 
        //In order to reduce darkening of some items with truee.js
        this.renderer.gammaOutput = _gammaOutput;

        if (this.is_edit_mode != true && this.is_mode_assy != true) {
            this.onWindowResize();
        }

    }


    //transit to the specified viewpoint and camera position
    ScreenUpdateViewEditor(cam_pos, target) {


        this.counter = 0;

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

        requestAnimationFrame(this.ScreenRenderTrans.bind(this));


        if (this.is_edit_mode) {
            this.DomUpdateView();
        }
    }


    //Change Annotation for Edit Window
    DomUpdateAnnotationEditor(id_annotation) {


        if (this.is_edit_mode) {

            this.selected_annotation = id_annotation;

            //Set Color of button
            let children = document.getElementById('edit_annotation_selection_panels').children;
            let buttunid = 'btn_annotation' + id_annotation;
            for (var j = 0; j < children.length; j++) {

                if ("button".localeCompare(children[j].tagName, {}, { sensitivity: "base" }) == 0) {

                    if (buttunid.localeCompare(children[j].id, {}, { sensitivity: "base" }) == 0) {
                        children[j].classList.replace('btn-outline-primary', 'btn-primary');

                    } else {
                        children[j].classList.replace('btn-primary', 'btn-outline-primary');
                    }
                }
            }

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



    //Moves the annotation position relative refer to parameter
    DomUpdateAnnotationPositionShift(px, py, pz) {

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

            //Edit
            //this.annotation[id_annotation].marker.pos.x += px;
            //this.annotation[id_annotation].marker.pos.y += py;
            //this.annotation[id_annotation].marker.pos.z += pz;

            this.annotation[id_annotation].marker.position.add(new THREE.Vector3(px, py, pz));

            //element.marker.position.set(element.pos_x, element.pos_y, element.pos_z);

        }

    }

    //指定されたIDのインストラクションに遷移する関数
    ComplexTransitionInstruction(id_instruct) {


        this.selected_instruction = id_instruct;

        this.orbit_active = false;

        //カメラ位置の変更
        //---------------------
        let i = this.instruction_gp[id_instruct].id_view;

        this.ScreenUpdateViewEditor(
            new THREE.Vector3(this.view_object[i].cam_pos_x, this.view_object[i].cam_pos_y, this.view_object[i].cam_pos_z),
            new THREE.Vector3(this.view_object[i].obt_target_x, this.view_object[i].obt_target_y, this.view_object[i].obt_target_z));

        if (this.is_edit_mode) {
            this.DomUpdateInstructionEditor(id_instruct);
        }
        this.DomUpdateInstructionViewer(id_instruct);

        this.DomUpdateAnnotationScreenDisplay(id_instruct);
    }

    ///Update Annotation Display
    DomUpdateAnnotationScreenDisplay(id_instruct) {
        //let obj = this;
        //console.log('called');
        this.annotation.forEach(function (element) {
            document.getElementById(this.annotation[element.id_annotation].web_id_annotation).hidden = !this.annotation_display[id_instruct][element.id_annotation].is_display;
            element.marker.visible = this.annotation_display[id_instruct][element.id_annotation].is_display;
        }.bind(this));
    }

    //視点変更(移動部分)
    ScreenRenderTrans() {

        //DomUpdateView();
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

        requestAnimationFrame(this.ScreenRenderTrans.bind(this));


        if (this.is_edit_mode) {
            this.DomUpdateView();
        }
    }

    //Update Instruction Statement and buttuns for Display
    DomUpdateInstructionViewer(id_instruct) {
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
    DomUpdateInstructionEditor(id_instruct) {
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
        document.getElementById('id_edit_view_input_id_article').value = this.view_object[i].id_article;
        document.getElementById('id_edit_view_input_id_view').value = this.view_object[i].id_view;
        document.getElementById('id_edit_view_input_title').value = this.view_object[i].title;

        //↓ Ref
        //https://qiita.com/diescake/items/70d9b0cbd4e3d5cc6fce
        //let obj = this.annotation_display;

        this.DomUpdateAnnotationDisplayEditor(id_instruct);

    }


    DomUpdateAnnotationDisplayEditor(id_instruct) {

        this.annotation.forEach(function (element) {
            document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_id_instruct').value = this[id_instruct][element.id_annotation].id_instruct;
            document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_is_display').checked = this[id_instruct][element.id_annotation].is_display;
        }.bind(this.annotation_display));
    }


    //通常の、orbit control有効状態でのレンダリング
    ScreenControlOrbital() {

        if (this.is_edit_mode) {
            this.DomUpdateView();
        }

        requestAnimationFrame(this.ScreenControlOrbital.bind(this));


        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);
        this.DomUpdateAnnotationScreenPosition();
    }


    //ビュー情報を更新する
    DomUpdateView() {


        document.getElementById('id_edit_view_input_cam_pos_x').value = Math.floor(this.camera_main.position.x * 100) / 100;
        document.getElementById('id_edit_view_input_cam_pos_y').value = Math.floor(this.camera_main.position.y * 100) / 100;
        document.getElementById('id_edit_view_input_cam_pos_z').value = Math.floor(this.camera_main.position.z * 100) / 100;

        document.getElementById('id_edit_view_input_cam_lookat_x').value = 0;
        document.getElementById('id_edit_view_input_cam_lookat_y').value = 0;
        document.getElementById('id_edit_view_input_cam_lookat_z').value = 0;

        document.getElementById('id_edit_view_input_cam_quat_x').value = Math.floor(this.camera_main.quaternion.x * 1000) / 1000;
        document.getElementById('id_edit_view_input_cam_quat_y').value = Math.floor(this.camera_main.quaternion.y * 1000) / 1000;
        document.getElementById('id_edit_view_input_cam_quat_z').value = Math.floor(this.camera_main.quaternion.z * 1000) / 1000;
        document.getElementById('id_edit_view_input_cam_quat_w').value = Math.floor(this.camera_main.quaternion.w * 1000) / 1000;

        document.getElementById('id_edit_view_input_obt_target_x').value = Math.floor(this.controls.target.x * 100) / 100;
        document.getElementById('id_edit_view_input_obt_target_y').value = Math.floor(this.controls.target.y * 100) / 100;
        document.getElementById('id_edit_view_input_obt_target_z').value = Math.floor(this.controls.target.z * 100) / 100;

    }

    //Update Annotation Position
    DomUpdateAnnotationScreenPosition() {


        let web_annotation;
        const canvas = this.renderer.domElement;
        const cm = this.camera_main;

        let ofx = document.getElementById('model_screen').getBoundingClientRect().left;
        let ofy = document.getElementById('model_screen').getBoundingClientRect().top;

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

    //Update Instruction with Ajax
    DbUpdateInstruction() {


        if (confirm('Are you update Instruction?')) {

            let updInstrruction = {
                id_article: document.getElementById('id_article').value,
                id_instruct: document.getElementById('instruction_id_instruct').value,
                id_view: document.getElementById('instruction_id_view').value,
                title: document.getElementById('instruction_title').value,
                short_description: document.getElementById('instruction_short_description').value,
                memo: document.getElementById('instruction_memo').value,
                display_order: document.getElementById('instruction_display_order').value
            };
            this.selected_instruction = document.getElementById('instruction_id_instruct').value;

            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;
            //データ更新
            //this.data_reflesh_without_model();

            //指定urlからデータを取得
            //fetch内の各引数は以下の通り。
            //第1引数は【アクションメソッドのPath】、
            //第2引数は【通信方法 例)Get または　Post】、
            //第3引数は【データの型】
            //サンプル例：fetch(Path,{method:"POST",body:formData})
            const response = fetch(this.str_url_base_edit_product_instruction, { //【重要ポイント】「await」句は削除すること
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updInstrruction)  // リクエスト本文にJSON形式の文字列を設定c
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ

                    if (data[0].updateresult == "Success") {

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {

                            console.log("viewid : " + this.selected_instruction.toString());
                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }

                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));

                    }
                });
        }
    }


    //Update Instruction with Ajax
    DbDeleteInstruction() {

        if (confirm('Are you delete Instruction?')) {

            let updInstrruction = {
                id_article: document.getElementById('id_article').value,
                id_instruct: document.getElementById('instruction_id_instruct').value,
            };

            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;

            //指定urlからデータを取得
            //fetch内の各引数は以下の通り。
            //第1引数は【アクションメソッドのPath】、
            //第2引数は【通信方法 例)Get または　Post】、
            //第3引数は【データの型】
            //サンプル例：fetch(Path,{method:"POST",body:formData})
            const response = fetch(this.str_url_base_delete_product_instruction, { //【重要ポイント】「await」句は削除すること
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updInstrruction)  // リクエスト本文にJSON形式の文字列を設定c
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ


                    if (data[0].updateresult == "Success") {

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {

                            /*
                            this.instruction_gp.forEach(function (element) {
                                let id;
                                id = element.id_instruct;

                                if (typeof id === "undefined") {

                                } else {
                                    this.selected_instruction = id;

                                }

                            }.bind(this));
                            */

                            let id;
                            let checked = false;
                            this.instruction_gp.forEach(function (element) {
                                id = element.id_instruct;
                                console.log(checked);
                                if (typeof id === "undefined") {

                                } else {
                                    if (checked) {

                                    } else {
                                        this.selected_instruction = id;
                                        checked = true;
                                    }
                                }

                            }.bind(this));


                            //this.instruction_gp.forEach
                            //console.log("Instruct Id : " + this.selected_instruction.toString());


                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }

                            //if (this.annotationthis.selected_annotation)
                            //this.DomUpdateAnnotationEditor(this.selected_annotation);

                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));

                        //console.log(this.instruction_gp);
                    }

                });
        }
    }


    //Update View with Ajax
    DbUpdateView() {


        //console.log("id_instruct_out:" + this.selected_instruction);
        //console.log("id_annotation_out:" + this.selected_annotation);

        //console.log(this.str_url_base_edit_product_annotation);

        if (confirm('Are you update View?')) {

            let updObject = {
                id_article: document.getElementById('id_edit_view_input_id_article').value,
                id_view: document.getElementById('id_edit_view_input_id_view').value,
                title: document.getElementById('id_edit_view_input_title').value,
                cam_pos_x: document.getElementById('id_edit_view_input_cam_pos_x').value,
                cam_pos_y: document.getElementById('id_edit_view_input_cam_pos_y').value,
                cam_pos_z: document.getElementById('id_edit_view_input_cam_pos_z').value,
                cam_lookat_x: document.getElementById('id_edit_view_input_cam_lookat_x').value,
                cam_lookat_y: document.getElementById('id_edit_view_input_cam_lookat_y').value,
                cam_lookat_z: document.getElementById('id_edit_view_input_cam_lookat_z').value,
                cam_quat_x: document.getElementById('id_edit_view_input_cam_quat_x').value,
                cam_quat_y: document.getElementById('id_edit_view_input_cam_quat_y').value,
                cam_quat_z: document.getElementById('id_edit_view_input_cam_quat_z').value,
                cam_quat_w: document.getElementById('id_edit_view_input_cam_quat_w').value,
                obt_target_x: document.getElementById('id_edit_view_input_obt_target_x').value,
                obt_target_y: document.getElementById('id_edit_view_input_obt_target_y').value,
                obt_target_z: document.getElementById('id_edit_view_input_obt_target_z').value
            };

            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;
            //データ更新
            const response = fetch(this.str_url_base_edit_product_view, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ
                    console.log(data[0].updateresult);

                    if (data[0].updateresult == "Success") {
                        //this.selected_annotation = data[0].id_annotation;

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {
                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }


                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));
                    }
                });
        }
    }


    //Delete View with Ajax
    DbDeleteView(id_view) {


        //console.log("id_instruct_out:" + this.selected_instruction);
        //console.log("id_annotation_out:" + this.selected_annotation);

        //console.log(this.str_url_base_edit_product_annotation);

        if (confirm('Are you update View?')) {

            let updObject = {
                id_article: this.id_article,
                id_view: id_view
            };

            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;

            //データ更新
            const response = fetch(this.str_url_base_delete_product_view, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ
                    console.log(data[0].updateresult);

                    if (data[0].updateresult == "Success") {
                        //this.selected_annotation = data[0].id_annotation;

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {
                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }


                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));
                    }
                });
        }
    }


    //Update Annotation with Ajax
    DbUpdateAnnotation() {


        console.log("id_instruct_out:" + this.selected_instruction);
        console.log("id_annotation_out:" + this.selected_annotation);

        console.log(this.str_url_base_edit_product_annotation);

        if (confirm('Are you update Annotation?')) {

            let updObject = {
                id_article: document.getElementById('id_edit_annotation_input_id_article').value,
                id_annotation: document.getElementById('id_edit_annotation_input_id_annotation').value,
                title: document.getElementById('id_edit_annotation_input_title').value,
                description1: document.getElementById('id_edit_annotation_input_description1').value,
                description2: document.getElementById('id_edit_annotation_input_description2').value,
                status: document.getElementById('id_edit_annotation_input_status').value,
                pos_x: document.getElementById('id_edit_annotation_input_pos_x').value,
                pos_y: document.getElementById('id_edit_annotation_input_pos_y').value,
                pos_z: document.getElementById('id_edit_annotation_input_pos_z').value
            };

            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;
            //データ更新
            const response = fetch(this.str_url_base_edit_product_annotation, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ

                    if (data[0].updateresult == "Success") {
                        this.selected_annotation = data[0].id_annotation;

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {
                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }


                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));
                    }
                });
        }
    }


    //Delete Annotation with Ajax
    DbDeleteAnnotation() {

        if (confirm('Are you delete Annotation?')) {

            let updObject = {
                id_article: document.getElementById('id_edit_annotation_input_id_article').value,
                id_annotation: document.getElementById('id_edit_annotation_input_id_annotation').value,
            };

            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;
            console.log(token);
            //指定urlからデータを取得
            //fetch内の各引数は以下の通り。
            //第1引数は【アクションメソッドのPath】、
            //第2引数は【通信方法 例)Get または　Post】、
            //第3引数は【データの型】
            //サンプル例：fetch(Path,{method:"POST",body:formData})
            const response = fetch(this.str_url_base_delete_product_annotation, { //【重要ポイント】「await」句は削除すること
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ


                    if (data[0].updateresult == "Success") {

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {

                            this.annotation.forEach(function (element) {
                                let id;
                                let checked = false;
                                id = element.id_annotation;

                                if (typeof id === "undefined") {

                                } else {
                                    if (checked) {

                                    } else {
                                        this.selected_annotation = id;
                                        checked = true;
                                    }
                                }

                            }.bind(this));


                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }


                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));

                    }

                });
        }
    }


    //Update AnnotationDisplay with Ajax
    DbUpdateAnnotationDisplay() {



        if (confirm('Are you update AnnotationDisplay?')) {

            let updObject = [];


            let i = 0;
            this.annotation.forEach(function (element) {
                updObject[i] = new AnnotationDisplay(
                    this.id_article,
                    document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_id_instruct').value,
                    element.id_annotation,
                    document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_is_display').checked
                );
                i += 1;
            }.bind(this));


            let token = document.getElementsByName("__RequestVerificationToken").item(0).value;
            //データ更新
            const response = fetch(this.str_url_base_edit_product_annotation_display, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "RequestVerificationToken": token
                },
                body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定
            })
                .then(response => {

                    return response.json();

                }).then(data => { // 処理が成功した場合に取得されるJSONデータ

                    if (data[0].updateresult == "Success") {
                        this.selected_annotation = data[0].id_annotation;

                        //データ更新
                        this.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (value) {
                            this.ComplexResetEnvironment();
                            this.ComplexTransitionInstruction(this.selected_instruction);

                            if (this.annotation.some(item => item.id_annotation === this.selected_annotation)) {
                                this.DomUpdateAnnotationEditor(this.selected_annotation);
                            }

                            alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                        }.bind(this));
                    }
                });
        }
    }

}

//TDArticleここまで


var adarticle = new TDArticle();


// ロード後に実行される処理
function startup() {


    const id_article = document.getElementById("id_article").value;
    const is_edit_mode = document.getElementById("is_edit_mode").value;



    adarticle.id_article = id_article;
//    adarticle.is_edit_mode = is_edit_mode;
    adarticle.is_edit_mode = toBoolean(is_edit_mode);

    adarticle.ComplexSetupEnvironmentInitial();

    //window.addEventListener("resize", resizewindow, false);
    window.addEventListener("resize", function () { adarticle.onWindowResize(); }, false);

    if (adarticle.is_edit_mode) {
        document.getElementById("screenshot").addEventListener('click', function () {
            GetScreenshotForUpload('view_capture', 'getimage', 'up_img_input');
        });
    }
    //adarticle.onWindowResize();


    function toBoolean(data) {
        return data.toLowerCase() === 'true';
    }
}

/*
function resizewindow() {
    adarticle.onWindowResize();
}

*/

//Load時のイベントリスナ追加
window.addEventListener('load', startup);




function GetScreenshotForUpload(id_parent_element, id_img, id_img_input) {
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