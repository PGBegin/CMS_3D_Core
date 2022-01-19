


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { marked } from 'marked';
import { Aarticle, Instruction, ViewObject, InstancePart, Annotation, AnnotationDisplay, Refelencematerial } from './tdarticle/tdarticle_Aarticle';



export class DataContainers {


    //API URL Base    
    str_url_partapi_base: string;

    url_api_dataget: string ="";
    str_url_base_prodobjectapi_articlemode: string;
    str_url_base_prodobjectapi_assymode: string;


    //Ajax DB Update Apis
    str_url_base_edit_product_instruction: string;
    str_url_base_delete_product_instruction: string;

    str_url_base_edit_product_view: string;
    str_url_base_delete_product_view: string;

    str_url_base_edit_product_annotation: string;
    str_url_base_delete_product_annotation: string;

    str_url_base_edit_product_annotation_display: string;


    //Model Objects
    article!: Aarticle;
    view_object: ViewObject[]=[];
    instruction_gp: Instruction[]=[];
    instance_part: InstancePart[]=[];
    annotation: Annotation[]=[];
    annotation_display: AnnotationDisplay[]=[];

    refelencematerial: Refelencematerial[]=[];


    id_article: number;
    id_startinst: number;
    id_assy: number;
    is_mode_assy: boolean;

    constructor() {

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
        //this.article;
        //this.view_object = [];
        //this.instruction_gp = [];
        //this.instance_part = [];
        //this.annotation = [];
        //this.annotation_display = [];
        //this.refelencematerial = [];


        this.id_article = 0;
        this.id_startinst = 0;
        this.id_assy = 0;
        this.is_mode_assy = false;
    }

    async ObjSetupAllObjectsWithoutInstanceModelFromDb() {


        let str_url_api = this.str_url_base_prodobjectapi_articlemode + new URLSearchParams({ id_article: this.id_article.toString() }).toString();

        if (this.is_mode_assy) {
            str_url_api = this.str_url_base_prodobjectapi_assymode + new URLSearchParams({ id_assy: this.id_assy.toString() }).toString();
        }




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
    ObjSetupAllObjectsWithoutInstanceModelFromJson(data: any) {


        this.view_object.length = 0;
        this.instruction_gp.length = 0;
        this.instance_part.length = 0;
        this.annotation.length = 0;
        this.annotation_display.length = 0;
        //let i: number;

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
                this.view_object.push(new ViewObject(

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
                ));
            }


            if (data[i].type == "instruction") {

                this.instruction_gp.push(new Instruction(
                    data[i].id_article,
                    data[i].id_instruct,
                    data[i].id_view,
                    data[i].title,
                    data[i].short_description,
                    data[i].display_order,
                    data[i].memo
                ));

            }


            if (data[i].type == "instance_part") {

                this.instance_part[data[i].id_inst] = new InstancePart(
                    data[i].id_assy,
                    data[i].id_inst,
                    data[i].id_part, null);
            }


            if (data[i].type == "annotation") {
                this.annotation.push(new Annotation(

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
                ));
            }

            if (data[i].type == "annotation_display") {
                this.annotation_display.push(new AnnotationDisplay(

                    data[i].id_article,
                    data[i].id_instruct,
                    data[i].id_annotation,
                    data[i].is_display
                ));
            }

            if (data[i].type == "refelencematerial") {
                this.refelencematerial.push(new Refelencematerial(
                    data[i].id_assy,
                    data[i].id_inst,
                    data[i].id_part,
                    data[i].model_name,
                    data[i].file_name,
                    data[i].file_length,
                    data[i].itemlink,
                    data[i].author,
                    data[i].license
                ));
            }

        }



        if (this.instruction_gp.length > 0) {
            const ar1_map = (this.instruction_gp.filter((x: Instruction) => typeof x.display_order === 'number')).map((x: Instruction) => x.display_order);


            this.id_startinst = this.instruction_gp.filter((x: Instruction) => x.display_order == Math.min.apply(null, ar1_map))[0].id_instruct;

            //this.id_startinst = this.instruction_gp.find(x => x.display_order == Math.min.apply(null, this.instruction_gp.map(x => x.display_order));
            //this.id_startinst = this.instruction_gp.filter((x: Instruction) => x.display_order == Math.min.apply(null, this.instruction_gp))[0].id_instruct;
        }

        //console.log(this.id_startinst);

    }


    //Loading Models
    ObjSetupInstancePartModelFromDb(scene: THREE.Scene) {

        const glfLoader = new GLTFLoader();

        //let scene = this.scene;

        this.instance_part.forEach(function (this: DataContainers, obj_instance_part: InstancePart) {
            let str_url_partapi = this.str_url_partapi_base + new URLSearchParams({ id_part: obj_instance_part.id_part.toString() }).toString();

            glfLoader.load(str_url_partapi, function (gltf) {



                document.getElementById('div_progressbar_modeldl')!.setAttribute('hidden', '');
                scene.add(gltf.scene);

            }, function (xhr) {

                document.getElementById('progressbar_modeldl')!.setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

            }, function (error) {

                console.error(error);

            });
        }.bind(this));
    }



    //Update Instruction with Ajax
    async dbUpdEditProductInstructionApi(updObject: any, token: string) {


        //データ更新
        //this.data_reflesh_without_model();

        //指定urlからデータを取得
        //fetch内の各引数は以下の通り。
        //第1引数は【アクションメソッドのPath】、
        //第2引数は【通信方法 例)Get または　Post】、
        //第3引数は【データの型】
        //サンプル例：fetch(Path,{method:"POST",body:formData})

        const response = await fetch(this.str_url_base_edit_product_instruction, { //【重要ポイント】「await」句は削除すること
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
        });
        const data = await response.json();
        return data;

    }

    //Delete Instruction with Ajax
    async dbUpdDeleteProductInstructionApi(updObject: any, token: string) {


        const response = await fetch(this.str_url_base_delete_product_instruction, { 
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)
        });
        const data = await response.json();
        return data;

    }


    //dbUpdEditProductViewApi
    async dbUpdEditProductViewApi(updObject: any, token: string) {


        const response = await fetch(this.str_url_base_edit_product_view, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
        });
        const data = await response.json();
        return data;

    }

    //dbUpdDeleteProductViewApi
    async dbUpdDeleteProductViewApi(updObject: any, token: string) {


        const response = await fetch(this.str_url_base_delete_product_view, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
        });
        const data = await response.json();
        return data;

    }




    //dbUpdEditProductAnnotationApi
    async dbUpdEditProductAnnotationApi(updObject: any, token: string) {


        const response = await fetch(this.str_url_base_edit_product_annotation, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
        });
        const data = await response.json();
        return data;

    }

    //dbUpdDeleteProductAnnotationApi
    async dbUpdDeleteProductAnnotationApi(updObject: any, token: string) {


        const response = await fetch(this.str_url_base_delete_product_annotation, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
        });
        const data = await response.json();
        return data;

    }

    //dbUpdEditProductAnnotationDisplayApi
    async dbUpdEditProductAnnotationDisplayApi(updObject: any, token: string) {


        const response = await fetch(this.str_url_base_edit_product_annotation_display, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "RequestVerificationToken": token
            },
            body: JSON.stringify(updObject)  // リクエスト本文にJSON形式の文字列を設定c
        });
        const data = await response.json();
        return data;

    }
}


//---------------------------------------------------------------------------
export class TDArticle {

    //Screen Size
    width: number;
    height: number;


    datacontainers!: DataContainers;

    camera_main!: THREE.PerspectiveCamera;
    controls!: OrbitControls;
    scene: THREE.Scene;

    gridHelper!: THREE.GridHelper;
    axisHelper!: THREE.AxesHelper;
    lightHelper!: THREE.DirectionalLightHelper;


    arrow_base: THREE.Vector3;


    light!: THREE.DirectionalLight;
    ambient!: THREE.AmbientLight;
    renderer!: THREE.WebGLRenderer;


    camera_main_startpos: THREE.Vector3;
    controls_target_startpos: THREE.Vector3;


    //
    selected_instruction: number=0;
    selected_view: number=0;
    selected_annotation: number=0;

    //Element Names for HTML TAGS    
    id_div_row_article: string;

    idhead_edit_annotation_display: string;

    id_instruction_controlpanel: string;
    id_edit_annotation_selection_panels: string;
    id_edit_annotation_position_panels: string;
    id_viewpoint_controlpanel: string;
    id_edit_annotation_display_tbody: string;
    id_edit_list_view_tbody: string;
    id_view_refelencematerial_table_tbody: string;

    // Parameter for View Transition
    counter: number;
    step: number;

    pitch_pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    pitch_target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    orbit_active: boolean;


    // Operation Mode
    is_edit_mode: boolean;
    is_display_helper: boolean;

    // 1 : landscape, 0:Portrait
    orientation_mode: number;

    constructor() {

        //Screen Size
        this.width = 720;
        this.height = 405;


        this.datacontainers = new DataContainers();

        this.scene = new THREE.Scene();


        this.camera_main_startpos = new THREE.Vector3(30, 30, 30);
        this.controls_target_startpos = new THREE.Vector3(0, 0, 0);

        this.arrow_base = new THREE.Vector3(-1, -1, -1);

        //Element Names for HTML TAGS
        this.id_div_row_article = "id_div_row_article";

        this.idhead_edit_annotation_display = "id_edit_annotation_display_";

        this.id_instruction_controlpanel = "control_panel_zone";
        this.id_edit_annotation_selection_panels = "edit_annotation_selection_panels";
        this.id_edit_annotation_position_panels = "edit_annotation_position_panels";
        this.id_viewpoint_controlpanel = "id_view_operation_panel";

        this.id_edit_annotation_display_tbody = "id_edit_annotation_display_tbody";

        this.id_edit_list_view_tbody = "id_edit_list_view_tbody";
        this.id_view_refelencematerial_table_tbody = "id_view_refelencematerial_table_tbody";
        // Parameter for View Transition
        this.counter = 0;
        this.step = 75;


        this.orbit_active = false;



        // Operation Mode
        this.is_edit_mode = true;
        this.is_display_helper = false;

        // 1 : landscape, 0:Portrait 
        this.orientation_mode = 1;

    }



    //onWindowResize
    onWindowResize() {
        //1.画面サイズを測定し、モードを判定する
        //0:縦モード、1:横モード


        if (this.is_edit_mode) {

            this.width = 0.95 * document.getElementById(this.id_div_row_article)!.clientWidth / 2;
            //this.width = 0.95 * document.documentElement.clientWidth / 2;
            this.height = this.width * 9 / 16;

            document.getElementById('id_contents_models')!.setAttribute("class", "");
            document.getElementById('id_contents_instructions')!.setAttribute("class", "");
            document.getElementById('id_contents_models')!.classList.add('col-6');
            document.getElementById('id_contents_instructions')!.classList.add('col-6');
        } else {

            // chk displaymode
            if (document.getElementById(this.id_div_row_article)!.clientWidth / document.getElementById(this.id_div_row_article)!.clientHeight > 1) {
//            if (document.documentElement.clientWidth / document.documentElement.clientHeight > 1) {
                this.orientation_mode = 1;
            } else {
                this.orientation_mode = 0;
            }

            if (this.orientation_mode == 1) {
                document.getElementById('id_contents_models')!.setAttribute("class", "");
                document.getElementById('id_contents_instructions')!.setAttribute("class", "");
                this.width = 0.95 * document.getElementById(this.id_div_row_article)!.clientWidth / 2;
//                this.width = 0.95 * document.documentElement.clientWidth / 2;
                this.height = this.width * 9 / 16;
                document.getElementById('id_contents_models')!.classList.add('col-6');
                document.getElementById('id_contents_instructions')!.classList.add('col-6');
            } else {
                document.getElementById('id_contents_models')!.setAttribute("class", "");
                document.getElementById('id_contents_instructions')!.setAttribute("class", "");
                this.width = 0.95 * document.getElementById(this.id_div_row_article)!.clientWidth;
//                this.width = 0.95 * document.documentElement.clientWidth;
                this.height = this.width * 9 / 16;
                document.getElementById('id_contents_models')!.classList.add('col-12');
                document.getElementById('id_contents_instructions')!.classList.add('col-12');

            }

            document.getElementById('preview_instruction_short_description')!.style.height =
                document.documentElement.clientHeight - document.getElementById('preview_instruction_short_description')!.getBoundingClientRect().top + 'px';

        }


        this.camera_main.aspect = this.width / this.height;
        this.camera_main.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);

    }




    // ↓ to DataContainers ---------------------------------------------------------------------------------------
    // ↑ to DataContainers ---------------------------------------------------------------------------------------

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


        //DBからデータを取得する
        this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {



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
                this.datacontainers.article.directional_light_intensity
                , this.datacontainers.article.directional_light_px, this.datacontainers.article.directional_light_py, this.datacontainers.article.directional_light_pz
                , this.datacontainers.article.ambient_light_intensity
                , this.datacontainers.article.gammaOutput);


            //データモデルを取得する
            this.datacontainers.ObjSetupInstancePartModelFromDb(this.scene);


            if (this.datacontainers.id_startinst == 0) {

                this.camera_main.position.copy(this.camera_main_startpos);

                this.controls.target.copy(this.controls_target_startpos);
            }
            else {
                this.ComplexTransitionInstruction(this.datacontainers.id_startinst);
            }

            if (this.is_edit_mode != true && this.datacontainers.is_mode_assy != true) {
                this.onWindowResize();
            }


            //orbitコントロールモードを有効にし、レンダリングを開始する
            this.orbit_active = true;

            this.ScreenControlOrbital();


        }.bind(this));


    }




    //Loading Article
    ObjSetupAarticleDefault() {

        if (this.datacontainers.id_article == 0) {

            this.datacontainers.article = new Aarticle(0, 0, "No Article", "", "", "", "", 0
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



    //Loading Annotations
    DomSetupAnnotationScreen() {



        const div_annotations = document.getElementById('annotations')!;

        if (div_annotations != null) {

            let temp_annotation : any;
            let title_annotation : any;
            let description1_annotation : any;

            //console.log("setupannotation\n");
            //console.log(div_annotations);

            while (div_annotations.firstChild) {
                div_annotations.removeChild(div_annotations.firstChild);
            }

            this.datacontainers.annotation.forEach(function (this: TDArticle, obj_annotation : Annotation) {


                temp_annotation = document.createElement('div');

                temp_annotation.id = obj_annotation.web_id_annotation;

                temp_annotation.classList.add('annotation');

                title_annotation = document.createElement('p');
                description1_annotation = document.createElement('p');


                title_annotation.innerHTML = obj_annotation.title;
                description1_annotation.innerHTML = obj_annotation.description1;

                temp_annotation.appendChild(title_annotation);
                temp_annotation.appendChild(description1_annotation);
                div_annotations.appendChild(temp_annotation);


                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0XCD0000 });
                obj_annotation.marker = new THREE.Mesh(geometry, material);
                //obj_annotation.marker.position.set(obj_annotation.pos_x, obj_annotation.pos_y, obj_annotation.pos_z);
                obj_annotation.marker.position.copy(obj_annotation.pos_pointing);
                obj_annotation.marker.visible = false;
                this.scene.add(obj_annotation.marker);

                obj_annotation.arrow = new THREE.ArrowHelper(this.arrow_base.normalize(), obj_annotation.pos_pointing.clone().sub(this.arrow_base), this.arrow_base.length(), 0xff0000);
                this.scene.add(obj_annotation.arrow);


            }.bind(this));

        }
    }



    //Create Instruction Select Panels
    DomSetupInstructionControler() {

        let pn = document.getElementById(this.id_instruction_controlpanel)!;

        while (pn.firstChild) {
            pn.removeChild(pn.firstChild);
        }

        //console.log(this.instruction_gp);

        let temp_bt;

        this.datacontainers.instruction_gp.forEach(function (this: TDArticle, obj_instruction: Instruction) {


            //console.log("id:" + element.id_instruct);

            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.ComplexTransitionInstruction.bind(this, obj_instruction.id_instruct);
            temp_bt.id = "btn_inst" + obj_instruction.id_instruct;
            temp_bt.classList.add('btn');
            temp_bt.classList.add('btn-outline-primary');
            temp_bt.textContent = obj_instruction.title;

            pn.appendChild(temp_bt);

        }.bind(this));
    }

    //Create Edit Annotation Selection Panels
    DomSetupAnnotationEditorSelectControls() {

        let pn = document.getElementById(this.id_edit_annotation_selection_panels)!;

        if (pn != null) {
            while (pn.firstChild) {
                pn.removeChild(pn.firstChild);
            }
            let temp_bt;

            this.datacontainers.annotation.forEach(function (this: TDArticle, obj_annotation: Annotation) {

                temp_bt = document.createElement('button');
                temp_bt.type = 'button';
                temp_bt.onclick = this.DomUpdateAnnotationEditor.bind(this, obj_annotation.id_annotation);
                temp_bt.id = "btn_annotation" + obj_annotation.id_annotation;
                temp_bt.classList.add('btn');
                temp_bt.classList.add('btn-outline-primary');
                temp_bt.textContent = obj_annotation.title;

                pn.appendChild(temp_bt);
            }.bind(this));
        }
    }

    //Create AnnotationDisplay Editor
    DomSetupAnnotationDisplayEditor() {

        //DomSetupAnnotationDisplayEditor
        let tbody = document.getElementById(this.id_edit_annotation_display_tbody)!;


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr;
            let temp_td;
            let temp_ipt;
            let i = 0;

            this.datacontainers.annotation.forEach(function (obj_annotation: Annotation) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and Low No.)

                temp_td = document.createElement('td');

                temp_td.innerText = (i + 1).toString();


                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_annotation.id_annotation}].id_edit_annotation_display_input_id_article`; 
                temp_ipt.name = `[${i}].id_article`;
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_annotation.id_article.toString();

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + obj_annotation.id_annotation + "]." + "id_edit_annotation_display_input_id_instruct";
                temp_ipt.name = "[" + i + "]." + "id_instruct";
                temp_ipt.type = "hidden";
                temp_ipt.value = "0";

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + obj_annotation.id_annotation + "]." + "id_edit_annotation_display_input_id_annotation";
                temp_ipt.name = "[" + i + "]." + "id_annotation";
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_annotation.id_annotation.toString();

                temp_td.appendChild(temp_ipt);


                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_annotation.id_annotation.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 03 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_annotation.title;

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Annotation Discription)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_annotation.description1;

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Check box for Display)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + obj_annotation.id_annotation + "]." + "id_edit_annotation_display_input_is_display";
                temp_ipt.name = `[${i}].is_display`;
                temp_ipt.type = "checkbox";
                temp_ipt.value = 'true';

                temp_td.appendChild(temp_ipt);


                temp_tr.appendChild(temp_td);

                tbody.appendChild(temp_tr);
                i += 1;
            }.bind(this));
        }
    }


    //Create AnnotationDisplay Editor
    DomSetupViewListEditor() {

        //this.id_edit_list_view_tbody = "id_edit_list_view_tbody";
        let tbody = document.getElementById(this.id_edit_list_view_tbody)!;


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr: HTMLTableRowElement;
            let temp_td: HTMLTableCellElement;
            let temp_ipt: HTMLInputElement;
            let temp_bt: HTMLButtonElement;
            let i = 0;


            //ID	title	X	Y	Z	REf	Delete
            this.datacontainers.view_object.forEach(function (this: TDArticle, obj_view: ViewObject) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and ID No.)

                temp_td = document.createElement('td');

                temp_td.innerText = (i + 1).toString();


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + obj_view.id_view + "]." + "id_edit_list_view_input_id_article";
                temp_ipt.name = "[" + i + "]." + "id_article";
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_view.id_article.toString();

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + obj_view.id_view + "]." + "id_edit_list_view_input_id_view";
                temp_ipt.name = "[" + i + "]." + "id_view";
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_view.id_view.toString();

                temp_td.appendChild(temp_ipt);



                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_view.id_view.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_view.title;

                temp_tr.appendChild(temp_td);

                // Colomn 03 (Pos X)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_view.cam_pos_x.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Pos Y)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_view.cam_pos_y.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Pos Z)
                temp_td = document.createElement('td');

                temp_td.innerText = obj_view.cam_pos_z.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 06 (REf)
                temp_td = document.createElement('td');


                let x = this.datacontainers.instruction_gp.filter((item: Instruction) => item.id_view === obj_view.id_view);
                //console.log(x);

                x.forEach(function (obj_instruction: Instruction) {
                    temp_td.innerText = temp_td.innerText + "ID:" + obj_instruction.id_instruct;
                    //temp_td.appendChild(temp_bt);
                });

                temp_tr.appendChild(temp_td);

                // Colomn 07 (Check box for Display)
                temp_td = document.createElement('td');


                temp_bt = document.createElement('button');
                temp_bt.type = 'button';
                temp_bt.onclick = this.ScreenUpdateViewEditor.bind(this, new THREE.Vector3(obj_view.cam_pos_x, obj_view.cam_pos_y, obj_view.cam_pos_z), new THREE.Vector3(obj_view.obt_target_x, obj_view.obt_target_y, obj_view.obt_target_z));
                temp_bt.classList.add('btn');
                temp_bt.classList.add('btn-primary');
                temp_bt.textContent = "Show";
                temp_td.appendChild(temp_bt);


                if (!this.datacontainers.instruction_gp.some((item: Instruction) => item.id_view === obj_view.id_view)) {
                    temp_bt = document.createElement('button');
                    temp_bt.type = 'button';
                    temp_bt.onclick = this.DbDeleteView.bind(this, obj_view.id_view);
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
        let tbody = document.getElementById(this.id_view_refelencematerial_table_tbody)!;


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr;
            let temp_td;
            let temp_a;
            let i = 0;

            this.datacontainers.refelencematerial.forEach(function (element: Refelencematerial) {

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

                temp_td.innerText = element.file_length.toString();

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


        //helper

        this.gridHelper = new THREE.GridHelper(200, 50);
        this.scene.add(this.gridHelper);


        //型が存在しないというエラーになるので一時的にコメントアウト。
        //this.axisHelper = new THREE.AxisHelper(1000);
        //this.scene.add(this.axisHelper);
        this.axisHelper = new THREE.AxesHelper(1000);
        this.scene.add(this.axisHelper);



        this.gridHelper.visible = this.is_display_helper;
        //型が存在しないというエラーになるので一時的にコメントアウト。
        this.axisHelper.visible = this.is_display_helper;

        //lightHelper = new THREE.DirectionalLightHelper(light, 20);
        //scene.add(lightHelper);
    }

    //Initialize Render Objects and Setting for Optional (Like Helpers)
    ComplexSetupRenderInitial(lint: number, lpx: number, lpy: number, lpz: number, anbint: number, _gammaOutput: boolean) {

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
        //this.renderer.gammaOutput = _gammaOutput;
        if (_gammaOutput) {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        } else {
            this.renderer.outputEncoding = THREE.LinearEncoding;
        }

        if (this.is_edit_mode != true && this.datacontainers.is_mode_assy != true) {
            this.onWindowResize();
        }

    }


    //transit to the specified viewpoint and camera position
    ScreenUpdateViewEditor(cam_pos: THREE.Vector3, target: THREE.Vector3) {


        this.counter = 0;


        this.pitch_pos.set((cam_pos.x - this.camera_main.position.x) / this.step, (cam_pos.y - this.camera_main.position.y) / this.step, (cam_pos.z - this.camera_main.position.z) / this.step);


        this.pitch_target.set((target.x - this.controls.target.x) / this.step, (target.y - this.controls.target.y) / this.step, (target.z - this.controls.target.z) / this.step);


        if (this.counter >= this.step) { return; }

        this.counter = this.counter + 1;
        this.camera_main.position.x += this.pitch_pos.x;
        this.camera_main.position.y += this.pitch_pos.y;
        this.camera_main.position.z += this.pitch_pos.z;


        this.controls.target.x += this.pitch_target.x;
        this.controls.target.y += this.pitch_target.y;
        this.controls.target.z += this.pitch_target.z;

        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);

        requestAnimationFrame(this.ScreenRenderTrans.bind(this));


        if (this.is_edit_mode) {
            this.DomUpdateView();
        }
    }


    //Change Annotation for Edit Window
    DomUpdateAnnotationEditor(id_annotation: number) {


        if (this.is_edit_mode) {

            this.selected_annotation = id_annotation;
            const index_annotation = this.datacontainers.annotation.findIndex(x => x.id_annotation == id_annotation);

            //Set Color of button
            let children = document.getElementById('edit_annotation_selection_panels')!.children;
            let buttunid = 'btn_annotation' + id_annotation;
            for (var j = 0; j < children.length; j++) {

                if ("button".localeCompare(children[j].tagName, undefined, { sensitivity: "base" }) == 0) {

                    if (buttunid.localeCompare(children[j].id, undefined, { sensitivity: "base" }) == 0) {
                        children[j].classList.replace('btn-outline-primary', 'btn-primary');

                    } else {
                        children[j].classList.replace('btn-primary', 'btn-outline-primary');
                    }
                }
            }

            //Edit
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_annotation')).value = this.datacontainers.annotation[index_annotation].id_annotation.toString();
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_title')).value = this.datacontainers.annotation[index_annotation].title;

            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_description1')).value = this.datacontainers.annotation[index_annotation].description1;
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_description2')).value = this.datacontainers.annotation[index_annotation].description2;

            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_status')).value = this.datacontainers.annotation[index_annotation].status.toString();


            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_x')).value = this.datacontainers.annotation[index_annotation].pos_pointing.x.toString();
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_y')).value = this.datacontainers.annotation[index_annotation].pos_pointing.y.toString();
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_z')).value = this.datacontainers.annotation[index_annotation].pos_pointing.z.toString();

            //Delete
            (<HTMLInputElement>document.getElementById('id_delete_annotation_input_id_annotation')).value = this.datacontainers.annotation[index_annotation].id_annotation.toString();
        }

    }



    //Moves the annotation position relative refer to parameter
    DomUpdateAnnotationPositionShift(px: number, py: number, pz: number) {

        //Relative


        const id_annotation = Number((<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_annotation')).value);
        const index_annotation = this.datacontainers.annotation.findIndex(x => x.id_annotation == id_annotation);

        if (this.is_edit_mode) {

            //Edit
            this.datacontainers.annotation[index_annotation].pos_pointing.add(new THREE.Vector3(px, py, pz));


            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_x')).value = this.datacontainers.annotation[index_annotation].pos_pointing.x.toString();
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_y')).value = this.datacontainers.annotation[index_annotation].pos_pointing.y.toString();
            (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_z')).value = this.datacontainers.annotation[index_annotation].pos_pointing.z.toString();

            //Edit
            //this.annotation[id_annotation].marker.pos.x += px;
            //this.annotation[id_annotation].marker.pos.y += py;
            //this.annotation[id_annotation].marker.pos.z += pz;

            this.datacontainers.annotation[index_annotation].marker.position.add(new THREE.Vector3(px, py, pz));
            this.datacontainers.annotation[index_annotation].arrow.position.add(new THREE.Vector3(px, py, pz));

            //element.marker.position.set(element.pos_x, element.pos_y, element.pos_z);

        }

    }

    //指定されたIDのインストラクションに遷移する関数
    ComplexTransitionInstruction(id_instruct: number) {


        this.selected_instruction = id_instruct;

        this.orbit_active = false;

        //カメラ位置の変更
        //---------------------
        let id_view = this.datacontainers.instruction_gp.find(x => x.id_instruct == id_instruct)!.id_view;
        let index_view = this.datacontainers.view_object.findIndex(x => x.id_view == id_view);
        //console.log("No:" + index_view.toString());

        this.ScreenUpdateViewEditor(
            new THREE.Vector3(this.datacontainers.view_object[index_view].cam_pos_x, this.datacontainers.view_object[index_view].cam_pos_y, this.datacontainers.view_object[index_view].cam_pos_z),
            new THREE.Vector3(this.datacontainers.view_object[index_view].obt_target_x, this.datacontainers.view_object[index_view].obt_target_y, this.datacontainers.view_object[index_view].obt_target_z));

        if (this.is_edit_mode) {
            this.DomUpdateInstructionEditor(id_instruct);
        }
        this.DomUpdateInstructionViewer(id_instruct);

        this.DomUpdateAnnotationScreenDisplay(id_instruct);
    }

    ///Update Annotation Display
    DomUpdateAnnotationScreenDisplay(id_instruct: number) {
        //let obj = this;
        //console.log('called');
        let index_instruction = this.datacontainers.instruction_gp.findIndex(x => x.id_instruct == id_instruct);

        this.datacontainers.annotation.forEach(function (this: TDArticle, element: Annotation, index : number)
        {

            const is_display = this.datacontainers.annotation_display.find(item => item.id_instruct == id_instruct && item.id_annotation == element.id_annotation)!.is_display;
            (<HTMLInputElement>document.getElementById(element.web_id_annotation)).hidden = !is_display;
            //element.marker.visible = is_display;
            element.arrow.visible = is_display;

            //console.log("[" + index_instruction + "]" + "[" + index + "]" + "\n");
        }.bind(this));
    }

    //視点変更(移動部分)
    ScreenRenderTrans() {

        //DomUpdateView();
        if (this.counter >= this.step) { return; }

        this.counter += 1;

        this.camera_main.position.x += this.pitch_pos.x;
        this.camera_main.position.y += this.pitch_pos.y;
        this.camera_main.position.z += this.pitch_pos.z;


        this.controls.target.x += this.pitch_target.x;
        this.controls.target.y += this.pitch_target.y;
        this.controls.target.z += this.pitch_target.z;

        this.controls.update();
        this.renderer.render(this.scene, this.camera_main);

        requestAnimationFrame(this.ScreenRenderTrans.bind(this));


        if (this.is_edit_mode) {
            this.DomUpdateView();
        }
    }

    //Update Instruction Statement and buttuns for Display
    DomUpdateInstructionViewer(id_instruct:number) {
        //let i = this.instruction_gp[id_instruct].id_view;
        let index_instruct = this.datacontainers.instruction_gp.findIndex(x => x.id_instruct == id_instruct);

        //console.log(window.innerWidth);

        //Update Instruction for Preview
        (<HTMLInputElement>document.getElementById('preview_instruction_short_description')).innerHTML = marked(this.datacontainers.instruction_gp[index_instruct].short_description);

        //Set Color of button
        let children = document.getElementById('control_panel_zone')!.children;
        let buttunid = 'btn_inst' + id_instruct;
        for (var j = 0; j < children.length; j++) {

            if ("button".localeCompare(children[j].tagName, undefined, { sensitivity: "base" }) == 0) {

                if (buttunid.localeCompare(children[j].id, undefined, { sensitivity: "base" }) == 0) {
                    children[j].classList.replace('btn-outline-primary', 'btn-primary');

                } else {
                    children[j].classList.replace('btn-primary', 'btn-outline-primary');
                }
            }
        }
    }


    //Update Instruction Statement and Controls for Display
    DomUpdateInstructionEditor(id_instruct: number) {
        //'use strict';



        //let i = this.instruction_gp[id_instruct].id_view;
        let index_inst = this.datacontainers.instruction_gp.findIndex(x => x.id_instruct == id_instruct);

        let index_view = this.datacontainers.view_object.findIndex(x => x.id_view == this.datacontainers.instruction_gp[index_inst].id_view);

        //Update Instruction for Edit
        (<HTMLInputElement>document.getElementById('instruction_title')).value = this.datacontainers.instruction_gp[index_inst].title.toString();
        (<HTMLInputElement>document.getElementById('instruction_id_view')).value = this.datacontainers.instruction_gp[index_inst].id_view.toString();
        (<HTMLInputElement>document.getElementById('instruction_short_description')).textContent = this.datacontainers.instruction_gp[index_inst].short_description;
        (<HTMLInputElement>document.getElementById('instruction_id_article')).value = this.datacontainers.instruction_gp[index_inst].id_article.toString();
        (<HTMLInputElement>document.getElementById('instruction_id_instruct')).value = this.datacontainers.instruction_gp[index_inst].id_instruct.toString();
        (<HTMLInputElement>document.getElementById('instruction_display_order')).value = this.datacontainers.instruction_gp[index_inst].display_order.toString();
        (<HTMLInputElement>document.getElementById('instruction_memo')).value = this.datacontainers.instruction_gp[index_inst].memo;
        (<HTMLInputElement>document.getElementById('instruction_short_description_length')).innerHTML = '(' + this.datacontainers.instruction_gp[index_inst].short_description.length + ')';


        //Update Instruction for Delete
        (<HTMLInputElement>document.getElementById('instruction_id_article_delete')).value = this.datacontainers.instruction_gp[index_inst].id_article.toString();
        (<HTMLInputElement>document.getElementById('instruction_id_instruct_delete')).value = this.datacontainers.instruction_gp[index_inst].id_instruct.toString();



        //Update View for Edit
        (<HTMLInputElement>document.getElementById('id_edit_view_input_id_article')).value = this.datacontainers.view_object[index_view].id_article.toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_id_view')).value = this.datacontainers.view_object[index_view].id_view.toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_title')).value = this.datacontainers.view_object[index_view].title;

        //↓ Ref
        //https://qiita.com/diescake/items/70d9b0cbd4e3d5cc6fce
        //let obj = this.annotation_display;

        this.DomUpdateAnnotationDisplayEditor(id_instruct);

    }


    DomUpdateAnnotationDisplayEditor(id_instruct : number) {

        this.datacontainers.annotation.forEach(function (this: AnnotationDisplay[], element: Annotation, index_annotation: number) {

            const annotation_display = this.find(item => item.id_instruct == id_instruct && item.id_annotation == element.id_annotation)!;



            (<HTMLInputElement>document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_id_instruct')).value = annotation_display.id_instruct.toString();
            (<HTMLInputElement>document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_is_display')).checked = annotation_display.is_display;



        }.bind(this.datacontainers.annotation_display));
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


        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_pos_x')).value = (Math.floor(this.camera_main.position.x * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_pos_y')).value = (Math.floor(this.camera_main.position.y * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_pos_z')).value = (Math.floor(this.camera_main.position.z * 100) / 100).toString();

        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_lookat_x')).value = '0';
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_lookat_y')).value = '0';
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_lookat_z')).value ='0';

        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_x')).value = (Math.floor(this.camera_main.quaternion.x * 1000) / 1000).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_y')).value = (Math.floor(this.camera_main.quaternion.y * 1000) / 1000).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_z')).value = (Math.floor(this.camera_main.quaternion.z * 1000) / 1000).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_w')).value = (Math.floor(this.camera_main.quaternion.w * 1000) / 1000).toString();

        (<HTMLInputElement>document.getElementById('id_edit_view_input_obt_target_x')).value = (Math.floor(this.controls.target.x * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_obt_target_y')).value = (Math.floor(this.controls.target.y * 100) / 100).toString();
        (<HTMLInputElement>document.getElementById('id_edit_view_input_obt_target_z')).value = (Math.floor(this.controls.target.z * 100) / 100).toString();

    }

    //Update Annotation Position
    DomUpdateAnnotationScreenPosition() {


        let web_annotation;
        const canvas = this.renderer.domElement;
        const cm = this.camera_main;
        const ab = this.arrow_base;

        let ofx = 0;// (<HTMLInputElement>document.getElementById('model_screen')).getBoundingClientRect().left;
        let ofy = 0;//(<HTMLInputElement>document.getElementById('model_screen')).getBoundingClientRect().top;

        this.datacontainers.annotation.forEach(function (element : Annotation) {

            const vector = element.pos_pointing.clone().sub(ab);
            vector.project(cm);


            vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
            vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

            vector.x = vector.x + ofx;// + window.pageXOffset;
            vector.y = vector.y + ofy;// + window.pageYOffset;
            //console.log(window.pageYOffset);

            web_annotation = document.getElementById(element.web_id_annotation)!;
            web_annotation.style.top = `${vector.y}px`;
            web_annotation.style.left = `${vector.x}px`;

        });

    }

    //Update Instruction with Ajax
    async DbUpdateInstruction() {


        if (confirm('Are you update Instruction?')) {

            let updInstrruction = {
                id_article: (<HTMLInputElement>document.getElementById('id_article')).value,
                id_instruct: (<HTMLInputElement>document.getElementById('instruction_id_instruct')).value,
                id_view: (<HTMLInputElement>document.getElementById('instruction_id_view')).value,
                title: (<HTMLInputElement>document.getElementById('instruction_title')).value,
                short_description: (<HTMLInputElement>document.getElementById('instruction_short_description')).value,
                memo: (<HTMLInputElement>document.getElementById('instruction_memo')).value,
                display_order: (<HTMLInputElement>document.getElementById('instruction_display_order')).value
            };
            this.selected_instruction = Number((<HTMLInputElement>document.getElementById('instruction_id_instruct')).value);

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;



            const data = await this.datacontainers.dbUpdEditProductInstructionApi(updInstrruction, token);

            if (data[0].updateresult == "Success") {

                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {

                    //console.log("viewid : " + this.selected_instruction.toString());

                    this.ComplexResetEnvironment();
                    this.ComplexTransitionInstruction(this.selected_instruction);

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }

                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));

            }

        }
    }


    //Update Instruction with Ajax
    async DbDeleteInstruction() {

        if (confirm('Are you delete Instruction?')) {

            let updInstrruction = {
                id_article: (<HTMLInputElement>document.getElementById('id_article')).value,
                id_instruct: (<HTMLInputElement>document.getElementById('instruction_id_instruct')).value,
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;


            const data = await this.datacontainers.dbUpdDeleteProductInstructionApi(updInstrruction, token);


            if (data[0].updateresult == "Success") {

                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {


                    let id;
                    let checked = false;
                    this.datacontainers.instruction_gp.forEach(function (this: TDArticle, element: Instruction) {
                        id = element.id_instruct;
                        //console.log(checked);
                        if (typeof id === "undefined") {

                        } else {
                            if (checked) {

                            } else {
                                this.selected_instruction = id;
                                checked = true;
                            }
                        }

                    }.bind(this));



                    this.ComplexResetEnvironment();
                    this.ComplexTransitionInstruction(this.selected_instruction);

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }


                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));

            }
        }
    }


    //Update View with Ajax
    async DbUpdateView() {


        //console.log("id_instruct_out:" + this.selected_instruction);
        //console.log("id_annotation_out:" + this.selected_annotation);

        //console.log(this.str_url_base_edit_product_annotation);

        if (confirm('Are you update View?')) {

            let updObject = {
                id_article: (<HTMLInputElement>document.getElementById('id_edit_view_input_id_article')).value,
                id_view: (<HTMLInputElement>document.getElementById('id_edit_view_input_id_view')).value,
                title: (<HTMLInputElement>document.getElementById('id_edit_view_input_title')).value,
                cam_pos_x: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_pos_x')).value,
                cam_pos_y: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_pos_y')).value,
                cam_pos_z: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_pos_z')).value,
                cam_lookat_x: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_lookat_x')).value,
                cam_lookat_y: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_lookat_y')).value,
                cam_lookat_z: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_lookat_z')).value,
                cam_quat_x: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_x')).value,
                cam_quat_y: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_y')).value,
                cam_quat_z: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_z')).value,
                cam_quat_w: (<HTMLInputElement>document.getElementById('id_edit_view_input_cam_quat_w')).value,
                obt_target_x: (<HTMLInputElement>document.getElementById('id_edit_view_input_obt_target_x')).value,
                obt_target_y: (<HTMLInputElement>document.getElementById('id_edit_view_input_obt_target_y')).value,
                obt_target_z: (<HTMLInputElement>document.getElementById('id_edit_view_input_obt_target_z')).value
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;


            const data = await this.datacontainers.dbUpdEditProductViewApi(updObject, token);

            if (data[0].updateresult == "Success") {
                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {
                    this.ComplexResetEnvironment();
                    this.ComplexTransitionInstruction(this.selected_instruction);

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }


                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));
            }
        }
    }


    //Delete View with Ajax
    async DbDeleteView(id_view: number) {


        //console.log("id_instruct_out:" + this.selected_instruction);
        //console.log("id_annotation_out:" + this.selected_annotation);

        //console.log(this.str_url_base_edit_product_annotation);

        if (confirm('Are you update View?')) {

            let updObject = {
                id_article: this.datacontainers.id_article,
                id_view: id_view
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;


            const data = await this.datacontainers.dbUpdDeleteProductViewApi(updObject, token);

            if (data[0].updateresult == "Success") {
                //this.selected_annotation = data[0].id_annotation;

                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {
                    this.ComplexResetEnvironment();
                    this.ComplexTransitionInstruction(this.selected_instruction);

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }


                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));
            }
        }
    }


    //Update Annotation with Ajax
    async DbUpdateAnnotation() {


        //console.log("id_instruct_out:" + this.selected_instruction);
        //console.log("id_annotation_out:" + this.selected_annotation);

        //console.log(this.datacontainers.str_url_base_edit_product_annotation);

        if (confirm('Are you update Annotation?')) {

            let updObject = {
                id_article: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_article')).value,
                id_annotation: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_annotation')).value,
                title: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_title')).value,
                description1: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_description1')).value,
                description2: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_description2')).value,
                status: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_status')).value,
                pos_x: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_x')).value,
                pos_y: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_y')).value,
                pos_z: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_pos_z')).value
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;

            const data = await this.datacontainers.dbUpdEditProductAnnotationApi(updObject, token);

            if (data[0].updateresult == "Success") {
                this.selected_annotation = data[0].id_annotation;

                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {
                    this.ComplexResetEnvironment();
                    this.ComplexTransitionInstruction(this.selected_instruction);

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }


                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));
            }

        }
    }


    //Delete Annotation with Ajax
    async DbDeleteAnnotation() {

        if (confirm('Are you delete Annotation?')) {

            let updObject = {
                id_article: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_article')).value,
                id_annotation: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_annotation')).value,
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;

            const data = await this.datacontainers.dbUpdDeleteProductAnnotationApi(updObject, token);

            if (data[0].updateresult == "Success") {

                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {

                    this.datacontainers.annotation.forEach(function (this: TDArticle, element: Annotation) {
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

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }


                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));

            }
        }
    }


    //Update AnnotationDisplay with Ajax
    async DbUpdateAnnotationDisplay() {



        if (confirm('Are you update AnnotationDisplay?')) {

            let updObject: AnnotationDisplay[] = [];
            //console.log('DbUpdateAnnotationDisplay');
            
            let i = 0;
            this.datacontainers.annotation.forEach(function (this: TDArticle, obj_annotation: Annotation) {
                //console.log('DbUpdateAnnotationDisplay' + i.toString());
                updObject[i] = new AnnotationDisplay(
                    this.datacontainers.id_article,
                    Number((<HTMLInputElement>document.getElementById('[' + obj_annotation.id_annotation + '].id_edit_annotation_display_input_id_instruct')).value),
                    obj_annotation.id_annotation,
                    (<HTMLInputElement>document.getElementById('[' + obj_annotation.id_annotation + '].id_edit_annotation_display_input_is_display')).checked
//                    (<HTMLInputElement>document.getElementById('[${obj_annotation.id_annotation}].id_edit_annotation_display_input_is_display')).checked
                    //`${vector.x}px`;
                );
                i += 1;
            }.bind(this));


            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;
            //console.log(updObject);

            const data = await this.datacontainers.dbUpdEditProductAnnotationDisplayApi(updObject, token);

            if (data[0].updateresult == "Success") {
                this.selected_annotation = data[0].id_annotation;

                //データ更新
                this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {
                    this.ComplexResetEnvironment();
                    this.ComplexTransitionInstruction(this.selected_instruction);

                    if (this.datacontainers.annotation.some((item: Annotation) => item.id_annotation === this.selected_annotation)) {
                        this.DomUpdateAnnotationEditor(this.selected_annotation);
                    }

                    alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
                }.bind(this));
            }
        }
    }

}

