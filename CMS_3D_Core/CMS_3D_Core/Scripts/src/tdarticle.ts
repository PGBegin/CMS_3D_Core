


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { marked } from 'marked';

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';


import { Aarticle, Instruction, ViewObject, InstancePart, Annotation, AnnotationDisplay, Refelencematerial, Light } from './tdarticle/tdarticle_Aarticle';
import { DataContainers } from './tdarticle/tdarticle_DataContainers';


/*
 cripts\src\tdarticle\tdarticle_DataContainers.ts
 Basic Rule
 
    DbXxxx      : Operation DB
    DomXxxxx    : Operation Dom html内のdomを指す
    ObjXxx      : Operation Object (データオブジェクト・シーンオブジェクト等)
    ScreenXxx   : 
    ComplexXxx  : 上記が組み合わさっているもの
    
 
 
 */

// The class for Helpers
export class TDHelpers {
    
    fixedAxisHelper!: THREE.AxesHelper;
    gridHelper!: THREE.GridHelper;
    axisHelper!: THREE.AxesHelper;

    constructor() {

        this.fixedAxisHelper = new THREE.AxesHelper(100);
        this.fixedAxisHelper.visible = false;

        
        this.gridHelper = new THREE.GridHelper(200, 200);
        this.gridHelper.visible = false;

        this.axisHelper = new THREE.AxesHelper(1000);
        this.axisHelper.visible = false;

    }
    setAllHelpersVisibility(is_display_helper: boolean) {

        this.fixedAxisHelper.visible = is_display_helper;
        this.gridHelper.visible = is_display_helper;
        this.axisHelper.visible = is_display_helper;

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

    tdHelpers = new TDHelpers();


    arrow_base: THREE.Vector3;


    renderer!: THREE.WebGLRenderer;


    camera_main_startpos: THREE.Vector3;
    controls_target_startpos: THREE.Vector3;


    //
    selected_instruction: number=0;
    selected_view: number=0;
    selected_annotation: number = 0;
    selected_id_light: number = 0;

    //Element Names for HTML TAGS    
    id_div_row_article: string;

    idhead_edit_annotation_display: string;

    id_instruction_controlpanel: string;
    id_edit_annotation_selection_panels: string;
    id_edit_annotation_position_panels: string;
    id_viewpoint_controlpanel: string;
    id_edit_annotation_display_tbody: string;
    id_edit_instance_tbody: string;
    id_edit_list_view_tbody: string;
    id_edit_light_list_tbody: string;
    id_view_refelencematerial_table_tbody: string;
    id_editor_base_controls: string;

    path_lf_png: string;

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


        this.id_edit_instance_tbody = "id_edit_instance_tbody";

        this.id_edit_list_view_tbody = "id_edit_list_view_tbody";

        this.id_edit_light_list_tbody = "id_edit_light_list_tbody";

        this.id_view_refelencematerial_table_tbody = "id_view_refelencematerial_table_tbody";

        this.id_editor_base_controls = "id_editor_base_controls";

        //path of png file
        this.path_lf_png = "/ContentsEditAttachment/GetAttachmentFile/28";


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


        //Serup Article Editor
        this.DomUpdateArticleEditor();


        //Setup Instruction Selection Control Panels (for Display and Editor)
        this.DomSetupInstructionControler();


        //Setup Control Panel of Editor Base
        this.DomSetupEditorBaseControls();


        //setup view operation panel
        //this.DomSetupLookingControler();

        //DomSetupViewListEditor
        this.DomSetupViewListEditor();


        //Create Edit Annotation Selection Panels
        this.DomSetupAnnotationEditorSelectControls();

        //Annotation Display Edit Panel
        this.DomSetupAnnotationDisplayEditor();

        //Update Instance Editor
        this.DomUpdateInstanceEditor();

        //Update LightList Editor
        this.DomUpdateLightListEditor();

        //Loading Annotations
        this.DomSetupAnnotationScreen();

    }



    //Setup
    ComplexSetupEnvironmentInitial() {


        //DBからデータを取得する
        this.datacontainers.ObjSetupAllObjectsWithoutInstanceModelFromDb().then(function (this: TDArticle, value: any) {



            //Loading Article
            this.ObjSetupAarticleDefault();

            //Serup Article Editor
            this.DomUpdateArticleEditor();


            //Setup Control Panel of Instruction
            this.DomSetupInstructionControler();


            //Setup Control Panel of Editor Base
            this.DomSetupEditorBaseControls();

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

            //Update Instance Editor
            this.DomUpdateInstanceEditor();

            //Update LightList Editor
            this.DomUpdateLightListEditor();

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
                , 0
                , 0
                , 0
                , 0
            );
        }
    }

    //SceneからAnnotation用のオブジェクトを取り除く
    ObjRemoveObjectScene() {

        this.datacontainers.annotation.forEach(function (this: TDArticle, obj_annotation: Annotation) {

            this.scene.remove(obj_annotation.marker);
            this.scene.remove(obj_annotation.arrow);

        }.bind(this));
    }


    //Loading Annotations
    DomSetupAnnotationScreen() {



        const div_annotations = document.getElementById('annotations')!;

        if (div_annotations != null) {

            let temp_annotation : any;
            let title_annotation : any;
            //let description1_annotation : any;

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
                title_annotation.classList.add('p_annotation');

                const description1_annotation = document.createElement('p');
                description1_annotation.classList.add('p_annotation');
                description1_annotation.id = obj_annotation.web_id_annotation_description;

                

                title_annotation.innerHTML = obj_annotation.title;
                description1_annotation.innerHTML = obj_annotation.description1;

                temp_annotation.appendChild(title_annotation);
                temp_annotation.appendChild(description1_annotation);
                div_annotations.appendChild(temp_annotation);


                //const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                //const material = new THREE.MeshBasicMaterial({ color: 0XCD0000 });
                //obj_annotation.marker = new THREE.Mesh(geometry, material);

                //obj_annotation.marker.position.copy(obj_annotation.pos_pointing);
                //obj_annotation.marker.visible = false;
                //this.scene.add(obj_annotation.marker);

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

    //Create Edit Annotation Selection Panels
    DomSetupEditorBaseControls() {

        let pn = document.getElementById(this.id_editor_base_controls)!;

        if (pn != null) {
            while (pn.firstChild) {
                pn.removeChild(pn.firstChild);
            }
            let temp_bt;


            temp_bt = document.createElement('button');
            temp_bt.type = 'button';
            temp_bt.onclick = this.DomCngHelper.bind(this);
            temp_bt.id = "btn_chg_helper";
            temp_bt.classList.add('btn');
            if (this.is_display_helper) {
                temp_bt.classList.add('btn-primary');
                temp_bt.textContent = "HIDE HELPER";
            } else {
                temp_bt.classList.add('btn-outline-primary');
                temp_bt.textContent = "SHOW HELPER";
            }

            pn.appendChild(temp_bt);
        }
    }



    //Initialize Render Objects and Setting for Optional (Like Helpers)
    DomCngHelper() {

        this.is_display_helper = !this.is_display_helper;
        //this.gridHelper.visible = this.is_display_helper;
        //this.axisHelper.visible = this.is_display_helper;
        this.tdHelpers.setAllHelpersVisibility(this.is_display_helper);
        this.DomSetupEditorBaseControls();

    }


    //Create Instance Editor
    DomUpdateInstanceEditor() {


        let tbody = document.getElementById(this.id_edit_instance_tbody)!;


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr;
            let temp_td;
            let temp_ipt;
            let i = 0;

            this.datacontainers.instance_part.forEach(function (obj_instance_part: InstancePart) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and Low No.)

                temp_td = document.createElement('td');

                temp_td.innerText = (i + 1).toString();


                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_instance_part.id_inst}].id_edit_instance_input_id_assy`;
                temp_ipt.name = `[${i}].id_assy`;
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_instance_part.id_assy.toString();

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_instance_part.id_inst}].id_edit_instance_input_id_inst`;
                temp_ipt.name = `[${i}].id_inst`;
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_instance_part.id_inst.toString();

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_instance_part.id_inst}].id_edit_instance_input_id_part`;
                temp_ipt.name = `[${i}].id_part`;
                temp_ipt.type = "hidden";
                temp_ipt.value = obj_instance_part.id_part.toString();

                temp_td.appendChild(temp_ipt);


                temp_tr.appendChild(temp_td);

                // Colomn 02 (Annotation Title)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_instance_part.id_inst}].id_edit_instance_input_pos_x`;
                temp_ipt.name = `[${i}].pos_x`;
                temp_ipt.type = "number";
                temp_ipt.value = obj_instance_part.pos.x.toString();
                temp_ipt.classList.add('form-control');
                //data-val-required要るなあ・・・・・・

                temp_td.appendChild(temp_ipt);

                temp_tr.appendChild(temp_td);



                // Colomn 05 (Check box for Display)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_instance_part.id_inst}].id_edit_instance_input_pos_y`;
                temp_ipt.name = `[${i}].pos_y`;
                temp_ipt.type = "number";
                temp_ipt.value = obj_instance_part.pos.y.toString();
                temp_ipt.classList.add('form-control');
                //data-val-required要るなあ・・・・・・

                temp_td.appendChild(temp_ipt);

                temp_tr.appendChild(temp_td);

                // Colomn 06 (Check box for Display Description)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${obj_instance_part.id_inst}].id_edit_instance_input_pos_z`;
                temp_ipt.name = `[${i}].pos_z`;
                temp_ipt.type = "number";
                temp_ipt.value = obj_instance_part.pos.z.toString();
                temp_ipt.classList.add('form-control');
                //data-val-required要るなあ・・・・・・

                temp_td.appendChild(temp_ipt);


                temp_tr.appendChild(temp_td);

                tbody.appendChild(temp_tr);
                i += 1;
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
                
                // Colomn 06 (Check box for Display Description)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.id = "[" + obj_annotation.id_annotation + "]." + "id_edit_annotation_display_input_is_display_description";
                temp_ipt.name = `[${i}].is_display_description`;
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

                //temp_td.innerText = obj_view.cam_pos_x.toString();
                temp_td.innerText = (Math.floor(obj_view.cam_pos_x * 1000) / 1000).toString();

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Pos Y)
                temp_td = document.createElement('td');

                //temp_td.innerText = obj_view.cam_pos_y.toString();
                temp_td.innerText = (Math.floor(obj_view.cam_pos_y * 1000) / 1000).toString();

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Pos Z)
                temp_td = document.createElement('td');

                //temp_td.innerText = obj_view.cam_pos_z.toString();
                temp_td.innerText = (Math.floor(obj_view.cam_pos_z * 1000) / 1000).toString();

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



    //Create LightList Editor Panel
    DomUpdateLightListEditor() {

        //this.id_edit_list_view_tbody = "id_edit_list_view_tbody";
        let tbody = document.getElementById(this.id_edit_light_list_tbody)!;


        if (tbody != null) {

            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            let temp_tr: HTMLTableRowElement;
            let temp_td: HTMLTableCellElement;
            let temp_ipt: HTMLInputElement;
            let temp_bt: HTMLButtonElement;
            let i = 0;

            //DomUpdateInstanceEditor

            //ID	title	X	Y	Z	REf	Delete
            this.datacontainers.light.forEach(function (this: TDArticle, light: Light) {

                temp_tr = document.createElement('tr');


                // Colomn 01 (Hidden Ids and ID No.)

                temp_td = document.createElement('td');

                temp_td.innerText = (i + 1).toString();


                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${light.id_light}].id_edit_light_list_tbody_input_id_id_article`;
                temp_ipt.name = `[${i}].id_article`;
                temp_ipt.type = "hidden";
                temp_ipt.value = light.id_article.toString();

                temp_td.appendChild(temp_ipt);


                temp_ipt = document.createElement('input');
                temp_ipt.id = `[${light.id_light}].id_edit_light_list_tbody_input_id_id_light`;
                temp_ipt.name = `[${i}].id_light`;
                temp_ipt.type = "hidden";
                temp_ipt.value = light.id_light.toString();

                temp_td.appendChild(temp_ipt);



                temp_tr.appendChild(temp_td);

                // Colomn 02 (Light Type)
                temp_td = document.createElement('td');

                temp_td.innerText = light.light_type;

                temp_tr.appendChild(temp_td);

                // Colomn 03 (Light Title)
                temp_td = document.createElement('td');

                temp_td.innerText = light.title;

                temp_tr.appendChild(temp_td);

                // Colomn 04 (Light short_description)
                temp_td = document.createElement('td');

                temp_td.innerText = light.short_description;

                temp_tr.appendChild(temp_td);

                // Colomn 05 (Light color)
                temp_td = document.createElement('td');

                temp_td.innerText = light.color.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 06 (Light intensity)
                temp_td = document.createElement('td');

                temp_td.innerText = light.intensity.toString();

                temp_tr.appendChild(temp_td);

                // Colomn 07 (Pos X)
                temp_td = document.createElement('td');

                //temp_td.innerText = light.px.toString();
                temp_td.innerText = (light.px ?? "").toString();

                temp_tr.appendChild(temp_td);

                // Colomn 08 (Pos Y)
                temp_td = document.createElement('td');

                //temp_td.innerText = light.py.toString();
                temp_td.innerText = (light.py ?? "").toString();

                temp_tr.appendChild(temp_td);

                // Colomn 09 (Pos Z)
                temp_td = document.createElement('td');

                //temp_td.innerText = light.pz.toString();
                temp_td.innerText = (light.pz ?? "").toString();

                temp_tr.appendChild(temp_td);


                // Colomn 10 (Check box for IsLensFlare)
                temp_td = document.createElement('td');
                temp_ipt = document.createElement('input');
                temp_ipt.type = "checkbox";
                temp_ipt.disabled = true;
                temp_ipt.checked = light.is_lensflare;

                temp_td.appendChild(temp_ipt);

                temp_tr.appendChild(temp_td);

                // Colomn 11 (LF size)
                temp_td = document.createElement('td');
                temp_td.innerText = (light.lfsize ?? "").toString();

                temp_tr.appendChild(temp_td);


                // Colomn 12 (Edit Bottun)

                temp_td = document.createElement('td');


                temp_bt = document.createElement('button');
                temp_bt.type = 'button';
                temp_bt.onclick = this.DomUpdateLightEditor.bind(this, light.id_light);
                temp_bt.id = `[${light.id_light}].id_edit_light_list_tbody_input_edit`;
                temp_bt.classList.add('btn');
                temp_bt.classList.add('btn-outline-primary');
                temp_bt.textContent = "Edit";

                temp_td.appendChild(temp_bt);




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

        //this.gridHelper = new THREE.GridHelper(200, 200);
        //this.scene.add(this.gridHelper);


        //型が存在しないというエラーになるので一時的にコメントアウト。
        //this.axisHelper = new THREE.AxesHelper(1000);
        //this.scene.add(this.axisHelper);

        this.scene.add(this.tdHelpers.gridHelper);
        this.scene.add(this.tdHelpers.axisHelper);
        this.scene.add(this.tdHelpers.fixedAxisHelper);

        //this.gridHelper.visible = this.is_display_helper;
        //型が存在しないというエラーになるので一時的にコメントアウト。
        //this.axisHelper.visible = this.is_display_helper;

        //lightHelper = new THREE.DirectionalLightHelper(light, 20);
        //scene.add(lightHelper);
    }

    //Initialize Render Objects and Setting for Optional (Like Helpers)
    ComplexSetupRenderInitial(lint: number, lpx: number, lpy: number, lpz: number, anbint: number, _gammaOutput: boolean) {

        // light

        this.setupLight();

        // main camara
        this.camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 6350000);

        //background
        this.scene.background = new THREE.Color(this.datacontainers.article.bg_c);

        // renderer
        //renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#model_screen'), antialias: true,  alpha: true 
        });

        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xefefef);
        //this.renderer.setClearColor(0x000000, 0); //default
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
        if (_gammaOutput) {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        } else {
            this.renderer.outputEncoding = THREE.LinearEncoding;
        }

        if (this.is_edit_mode != true && this.datacontainers.is_mode_assy != true) {
            this.onWindowResize();
        }

    }

    //Lightを設定する。
    setupLight() {

        this.datacontainers.light.forEach(function (this: TDArticle, obj_light: Light) {

            if (obj_light.light_type == "DirectionalLight") {

                obj_light.light_object = new THREE.DirectionalLight(obj_light.color, obj_light.intensity);
                obj_light.light_object.position.set(obj_light.px, obj_light.py, obj_light.pz);
                this.scene.add(obj_light.light_object);
            }
            else if (obj_light.light_type == "AmbientLight") {
                // light
                obj_light.light_object = new THREE.AmbientLight(obj_light.color, obj_light.intensity);
                this.scene.add(obj_light.light_object);
            }
            else if (obj_light.light_type == "PointLight") {
                // light
                obj_light.light_object = new THREE.PointLight(obj_light.color, obj_light.intensity, obj_light.distance, obj_light.decay);
                obj_light.light_object.position.set(obj_light.px, obj_light.py, obj_light.pz);
                this.scene.add(obj_light.light_object);

                if (obj_light.is_lensflare) {
                    //------------------------------------------------------------
                    //このローダーは本来はもっと別の場所にあるが、暫定的にここに移した
                    // lensflares
                    const textureLoader = new THREE.TextureLoader();

                    //const textureFlare0 = textureLoader.load('https://threejs.org/examples/textures/lensflare/lensflare0.png');

                    //const textureFlare0 = textureLoader.load('');

                    const textureFlare0 = textureLoader.load(this.path_lf_png);


                    const lensflare = new Lensflare();
                    lensflare.addElement(new LensflareElement(textureFlare0, obj_light.lfsize, 0, obj_light.light_object.color));
                    obj_light.light_object.add(lensflare);
                    //-------------------------------------------------------------

                }
            }
        }.bind(this));
    }



    //Change Article for Edit Window
    DomUpdateArticleEditor() {


        if (this.is_edit_mode) {


            console.log(this.datacontainers.article.title.toString());
            //Edit
            (<HTMLInputElement>document.getElementById('article_id_id_article')).value = this.datacontainers.article.id_article.toString();
            (<HTMLInputElement>document.getElementById('article_id_id_assy')).value = this.datacontainers.article.id_assy.toString();

            (<HTMLInputElement>document.getElementById('article_id_status')).value = this.datacontainers.article.status.toString();



            (<HTMLInputElement>document.getElementById('article_id_title')).value = this.datacontainers.article.title.toString();
            (<HTMLInputElement>document.getElementById('article_id_short_description')).value = this.datacontainers.article.short_description;
            (<HTMLInputElement>document.getElementById('article_id_long_description')).value = this.datacontainers.article.long_description;
            (<HTMLInputElement>document.getElementById('article_id_meta_description')).value = this.datacontainers.article.meta_description;
            (<HTMLInputElement>document.getElementById('article_id_meta_category')).value = this.datacontainers.article.meta_category;


            (<HTMLInputElement>document.getElementById('article_id_gammaOutput')).checked = this.datacontainers.article.gammaOutput;

            (<HTMLInputElement>document.getElementById('article_id_bg_c')).value = this.datacontainers.article.bg_c.toString();
            (<HTMLInputElement>document.getElementById('article_id_bg_h')).value = this.datacontainers.article.bg_h.toString();
            (<HTMLInputElement>document.getElementById('article_id_bg_s')).value = this.datacontainers.article.bg_s.toString();
            (<HTMLInputElement>document.getElementById('article_id_bg_l')).value = this.datacontainers.article.bg_l.toString();
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


            //Hilighting Annotation
            this.datacontainers.annotation.forEach(function (this: TDArticle, obj_annotation: Annotation) {

                (<HTMLInputElement>document.getElementById(obj_annotation.web_id_annotation)).classList.remove("annotation_editmode");

            }.bind(this));
            (<HTMLInputElement>document.getElementById(this.datacontainers.annotation[index_annotation].web_id_annotation)).classList.add("annotation_editmode");




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


    //Change Annotation for Edit Window
    DomUpdateLightEditor(id_light: number) {


        if (this.is_edit_mode) {

            this.selected_id_light = id_light;
            const index_light = this.datacontainers.light.findIndex(x => x.id_light == id_light);

            //Set Color of button

            this.datacontainers.light.forEach(function (this: TDArticle, light: Light) {                

                (<HTMLInputElement>document.getElementById(`[${light.id_light}].id_edit_light_list_tbody_input_edit`)).classList.replace('btn-primary', 'btn-outline-primary');

            }.bind(this));


            (<HTMLInputElement>document.getElementById(`[${this.selected_id_light}].id_edit_light_list_tbody_input_edit`)).classList.replace('btn-outline-primary', 'btn-primary');

            /*
            //Hilighting Annotation
            this.datacontainers.light.forEach(function (this: TDArticle, obj_light: Light) {

                (<HTMLInputElement>document.getElementById(obj_annotation.web_id_annotation)).classList.remove("annotation_editmode");

            }.bind(this));
            (<HTMLInputElement>document.getElementById(this.datacontainers.annotation[index_annotation].web_id_annotation)).classList.add("annotation_editmode");
            */


            
            //Edit
            (<HTMLInputElement>document.getElementById('id_edit_light_id_article')).value = this.datacontainers.light[index_light].id_article.toString();
            (<HTMLInputElement>document.getElementById('id_edit_light_id_light')).value = this.datacontainers.light[index_light].id_light.toString();
            (<HTMLInputElement>document.getElementById('id_edit_light_id_light_type')).value = this.datacontainers.light[index_light].light_type;

            (<HTMLInputElement>document.getElementById('id_edit_light_title')).value = this.datacontainers.light[index_light].title;
            (<HTMLInputElement>document.getElementById('id_edit_light_short_description')).value = this.datacontainers.light[index_light].short_description;

            (<HTMLInputElement>document.getElementById('id_edit_light_color')).value = (this.datacontainers.light[index_light].color ?? "").toString();
            (<HTMLInputElement>document.getElementById('id_edit_light_intensity')).value = (this.datacontainers.light[index_light].intensity ?? "").toString();


            (<HTMLInputElement>document.getElementById('id_edit_light_px')).value = (this.datacontainers.light[index_light].px ?? "").toString();
            (<HTMLInputElement>document.getElementById('id_edit_light_py')).value = (this.datacontainers.light[index_light].py ?? "").toString();
            (<HTMLInputElement>document.getElementById('id_edit_light_pz')).value = (this.datacontainers.light[index_light].pz ?? "").toString();


            (<HTMLInputElement>document.getElementById('id_edit_light_distance')).value = (this.datacontainers.light[index_light].distance ?? "").toString();
            (<HTMLInputElement>document.getElementById('id_edit_light_decay')).value = (this.datacontainers.light[index_light].decay ?? "").toString();

            (<HTMLInputElement>document.getElementById('id_edit_light_is_lensflare')).checked = this.datacontainers.light[index_light].is_lensflare ?? false;
            (<HTMLInputElement>document.getElementById('id_edit_light_lfsize')).value = (this.datacontainers.light[index_light].lfsize ?? "").toString();
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

            //this.datacontainers.annotation[index_annotation].marker.position.add(new THREE.Vector3(px, py, pz));
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
            const annotation_display = this.datacontainers.annotation_display.find(item => item.id_instruct == id_instruct && item.id_annotation == element.id_annotation);
            const is_display = annotation_display!.is_display;

            (<HTMLInputElement>document.getElementById(element.web_id_annotation)).hidden = !is_display;
            //element.marker.visible = is_display;
            element.arrow.visible = is_display;

            //control display description
            if (annotation_display!.is_display_description) {
                (<HTMLInputElement>document.getElementById(element.web_id_annotation_description)).style.display = 'inherit';
            } else {
                (<HTMLInputElement>document.getElementById(element.web_id_annotation_description)).style.display = 'none';
            }

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
        (<HTMLInputElement>document.getElementById('instruction_short_description')).value = this.datacontainers.instruction_gp[index_inst].short_description;
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
            (<HTMLInputElement>document.getElementById('[' + element.id_annotation + '].id_edit_annotation_display_input_is_display_description')).checked = annotation_display.is_display_description;



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
        this.DomUpdateFixedAxisHelperScreenPosition();
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


    //Update Annotation Position
    DomUpdateFixedAxisHelperScreenPosition() {
        //this.tdHelpers.fixedAxisHelper.position.set(1, 1, 1);

        /*
        const canvas = this.renderer.domElement;
        const cm = this.camera_main;

        //const v = new Vector3(1, 1, 1);
        const v = new Vector3(0, 0, 0,);
        const x = new THREE.
        v.unproject(cm);
        this.tdHelpers.fixedAxisHelper.position.set(v.x, v.y, v.z);
        console.log(v);
        console.log(cm.position);*/

    }


    //Update Instruction with Ajax
    async DbUpdateArticle() {


        if (confirm('Are you update Article?')) {

            let updObject = {
                id_article: (<HTMLInputElement>document.getElementById('article_id_id_article')).value,
                id_assy: (<HTMLInputElement>document.getElementById('article_id_id_assy')).value,
                title: (<HTMLInputElement>document.getElementById('article_id_title')).value,
                short_description: (<HTMLInputElement>document.getElementById('article_id_short_description')).value,
                long_description: (<HTMLInputElement>document.getElementById('article_id_long_description')).value,
                meta_description: (<HTMLInputElement>document.getElementById('article_id_meta_description')).value,
                meta_category: (<HTMLInputElement>document.getElementById('article_id_meta_category')).value,

                status: (<HTMLInputElement>document.getElementById('article_id_status')).value,

                gammaOutput: (<HTMLInputElement>document.getElementById('article_id_gammaOutput')).checked,
                
                bg_c: (<HTMLInputElement>document.getElementById('article_id_bg_c')).value,
                bg_h: (<HTMLInputElement>document.getElementById('article_id_bg_h')).value,
                bg_s: (<HTMLInputElement>document.getElementById('article_id_bg_s')).value,
                bg_l: (<HTMLInputElement>document.getElementById('article_id_bg_l')).value

            };
            this.selected_instruction = Number((<HTMLInputElement>document.getElementById('instruction_id_instruct')).value);

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;


            //console.log(updObject);
            const data = await this.datacontainers.dbUpdEditProductArticleApi(updObject, token);

            if (data[0].updateresult == "Success") {

                //remove scene
                this.ObjRemoveObjectScene();

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

                //remove scene
                this.ObjRemoveObjectScene();

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


    //Delete Instruction with Ajax
    async DbDeleteInstruction() {

        if (confirm('Are you delete Instruction?')) {

            let updInstrruction = {
                id_article: (<HTMLInputElement>document.getElementById('id_article')).value,
                id_instruct: (<HTMLInputElement>document.getElementById('instruction_id_instruct')).value,
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;


            const data = await this.datacontainers.dbUpdDeleteProductInstructionApi(updInstrruction, token);


            if (data[0].updateresult == "Success") {

                //remove scene
                this.ObjRemoveObjectScene();

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

                //remove scene
                this.ObjRemoveObjectScene();

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



        if (confirm('Are you update View?')) {

            let updObject = {
                id_article: this.datacontainers.id_article,
                id_view: id_view
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;


            const data = await this.datacontainers.dbUpdDeleteProductViewApi(updObject, token);

            if (data[0].updateresult == "Success") {

                //remove scene
                this.ObjRemoveObjectScene();

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

        if (confirm('Are you update Annotation?')) {

            let updObject = {
                //id_article: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_article')).value,
                id_article: this.datacontainers.id_article,
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

                //remove scene
                this.ObjRemoveObjectScene();

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
                //id_article: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_article')).value,
                id_article: this.datacontainers.id_article,
                id_annotation: (<HTMLInputElement>document.getElementById('id_edit_annotation_input_id_annotation')).value,
            };

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;

            const data = await this.datacontainers.dbUpdDeleteProductAnnotationApi(updObject, token);

            if (data[0].updateresult == "Success") {

                //remove scene
                this.ObjRemoveObjectScene();

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
            
            let i = 0;
            this.datacontainers.annotation.forEach(function (this: TDArticle, obj_annotation: Annotation) {

                updObject[i] = new AnnotationDisplay(
                    this.datacontainers.id_article,
                    Number((<HTMLInputElement>document.getElementById('[' + obj_annotation.id_annotation + '].id_edit_annotation_display_input_id_instruct')).value),
                    obj_annotation.id_annotation,
                    (<HTMLInputElement>document.getElementById('[' + obj_annotation.id_annotation + '].id_edit_annotation_display_input_is_display')).checked,
                    (<HTMLInputElement>document.getElementById('[' + obj_annotation.id_annotation + '].id_edit_annotation_display_input_is_display_description')).checked //IDの決定から必要
                );
                i += 1;
            }.bind(this));


            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;

            const data = await this.datacontainers.dbUpdEditProductAnnotationDisplayApi(updObject, token);

            if (data[0].updateresult == "Success") {
                this.selected_annotation = data[0].id_annotation;

                //remove scene
                this.ObjRemoveObjectScene();

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



    //Update Light with Ajax
    async DbUpdateLight() {

        if (confirm('Are you update Light?')) {

            let updObject = {
                id_article: this.datacontainers.id_article,
                id_light: Number((<HTMLInputElement>document.getElementById('id_edit_light_id_light')).value ?? null),
                light_type:(<HTMLInputElement>document.getElementById('id_edit_light_id_light_type')).value,

                title: (<HTMLInputElement>document.getElementById('id_edit_light_title')).value,
                short_description: (<HTMLInputElement>document.getElementById('id_edit_light_short_description')).value,

                color: Number((<HTMLInputElement>document.getElementById('id_edit_light_color')).value ?? null),
                intensity: Number((<HTMLInputElement>document.getElementById('id_edit_light_intensity')).value ?? null),


                px: Number((<HTMLInputElement>document.getElementById('id_edit_light_px')).value ?? null),
                py: Number((<HTMLInputElement>document.getElementById('id_edit_light_py')).value ?? null),
                pz: Number((<HTMLInputElement>document.getElementById('id_edit_light_pz')).value ?? null),


                distance: Number((<HTMLInputElement>document.getElementById('id_edit_light_distance')).value ?? null),
                decay: Number((<HTMLInputElement>document.getElementById('id_edit_light_decay')).value ?? null),

                is_lensflare: (<HTMLInputElement>document.getElementById('id_edit_light_is_lensflare')).checked ?? null,
                lfsize: Number((<HTMLInputElement>document.getElementById('id_edit_light_lfsize')).value ?? null)
            };

            this.selected_instruction = Number((<HTMLInputElement>document.getElementById('instruction_id_instruct')).value);

            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;

            console.log("DbUpdateLight");
            console.log(updObject);
            const data = await this.datacontainers.dbUpdEditProductLightApi(updObject, token);

            if (data[0].updateresult == "Success") {

                //remove scene
                this.ObjRemoveObjectScene();

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

            } else {
                alert('Result : ' + data[0].updatemode + ' ' + data[0].updateresult);
            }

        }
    }



    //Update AnnotationDisplay with Ajax
    async DbUpdateInstance() {



        if (confirm('Are you update Instance?')) {

            let updObject: any[] = [];

            let i = 0;
            this.datacontainers.instance_part.forEach(function (this: TDArticle, obj_instance_part: InstancePart) {

                updObject[i] = {
                    
                    id_assy:Number((<HTMLInputElement>document.getElementById(`[${obj_instance_part.id_inst}].id_edit_instance_input_id_assy`)).value),
                    id_inst:Number((<HTMLInputElement>document.getElementById(`[${obj_instance_part.id_inst}].id_edit_instance_input_id_inst`)).value),
                    id_part:Number((<HTMLInputElement>document.getElementById(`[${obj_instance_part.id_inst}].id_edit_instance_input_id_part`)).value),
                    pos_x: Number((<HTMLInputElement>document.getElementById(`[${obj_instance_part.id_inst}].id_edit_instance_input_pos_x`)).value),
                    pos_y: Number((<HTMLInputElement>document.getElementById(`[${obj_instance_part.id_inst}].id_edit_instance_input_pos_y`)).value),
                    pos_z: Number((<HTMLInputElement>document.getElementById(`[${obj_instance_part.id_inst}].id_edit_instance_input_pos_z`)).value),
                };


                i += 1;
            }.bind(this));


            let token = (<HTMLInputElement>document.getElementsByName("__RequestVerificationToken").item(0)).value;

            const data = await this.datacontainers.dbUpdEditProductInstanceApi(updObject, token);

            if (data[0].updateresult == "Success") {
                this.selected_annotation = data[0].id_annotation;

                //remove scene
                this.ObjRemoveObjectScene();

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