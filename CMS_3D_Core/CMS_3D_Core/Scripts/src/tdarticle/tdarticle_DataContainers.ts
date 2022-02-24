import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import { marked } from 'marked';

//import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';


import { Aarticle, Instruction, ViewObject, InstancePart, Annotation, AnnotationDisplay, Refelencematerial, Light } from './tdarticle_Aarticle';



export class DataContainers {


    //API URL Base    
    str_url_partapi_base: string;

    url_api_dataget: string = "";
    str_url_base_prodobjectapi_articlemode: string;
    str_url_base_prodobjectapi_assymode: string;


    //Ajax DB Update Apis
    str_url_base_edit_product_article: string;

    str_url_base_edit_product_instruction: string;
    str_url_base_delete_product_instruction: string;

    str_url_base_edit_product_view: string;
    str_url_base_delete_product_view: string;

    str_url_base_edit_product_annotation: string;
    str_url_base_delete_product_annotation: string;

    str_url_base_edit_product_annotation_display: string;
    str_url_base_edit_product_light: string;

    str_url_base_edit_product_instance: string;


    //Model Objects
    article!: Aarticle;
    view_object: ViewObject[] = [];
    instruction_gp: Instruction[] = [];
    instance_part: InstancePart[] = [];
    annotation: Annotation[] = [];
    annotation_display: AnnotationDisplay[] = [];
    light: Light[] = [];

    refelencematerial: Refelencematerial[] = [];


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
        this.str_url_base_edit_product_article = "/ContentsOperatorForArticleApis/EditProductArticleApi";
        this.str_url_base_edit_product_instruction = "/ContentsOperatorForArticleApis/EditProductInstructionApi";
        this.str_url_base_delete_product_instruction = "/ContentsOperatorForArticleApis/DeleteProductInstructionApi";

        this.str_url_base_edit_product_view = "/ContentsOperatorForArticleApis/EditProductViewApi";
        this.str_url_base_delete_product_view = "/ContentsOperatorForArticleApis/DeleteProductViewApi";

        this.str_url_base_edit_product_annotation = "/ContentsOperatorForArticleApis/EditProductAnnotationApi";
        this.str_url_base_delete_product_annotation = "/ContentsOperatorForArticleApis/DeleteProductAnnotationApi";

        this.str_url_base_edit_product_annotation_display = "/ContentsOperatorForArticleApis/EditProductAnnotationDisplayApi";

        this.str_url_base_edit_product_light = "/ContentsOperatorForArticleApis/EditProductLightApi"

        this.str_url_base_edit_product_instance = "/ContentsOperatorForArticleApis/EditProductInstanceApi";


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
                console.log(data);
                this.ObjSetupAllObjectsWithoutInstanceModelFromJson(data);
                console.log(this.article);

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
        this.light.length = 0;
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
                    data[i].id_attachment_for_eye_catch,
                    data[i].bg_c,
                    data[i].bg_h,
                    data[i].bg_s,
                    data[i].bg_l,
                    data[i].isStarrySky
                );
                //console.log(data[i]);
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
                    data[i].id_part,
                    data[i].pos_x,
                    data[i].pos_y,
                    data[i].pos_z,
                    null);
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
                    'id_annotation_' + data[i].id_annotation,
                    'id_annotation_description_' + data[i].id_annotation
                ));
            }

            if (data[i].type == "annotation_display") {
                this.annotation_display.push(new AnnotationDisplay(

                    data[i].id_article,
                    data[i].id_instruct,
                    data[i].id_annotation,
                    data[i].is_display,
                    data[i].is_display_description
                ));
            }


            if (data[i].type == "light") {
                this.light.push(new Light(
                    data[i].id_article,
                    data[i].id_light,
                    data[i].light_type,
                    data[i].title,
                    data[i].short_description,
                    data[i].color,
                    data[i].intensity,
                    data[i].px,
                    data[i].py,
                    data[i].pz,
                    data[i].distance,
                    data[i].decay,
                    data[i].power,
                    data[i].shadow,
                    data[i].tx,
                    data[i].ty,
                    data[i].tz,
                    data[i].skycolor,
                    data[i].groundcolor,
                    data[i].is_lensflare,
                    data[i].lfsize
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

        console.log(this.light);


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


                gltf.scene.position.add(obj_instance_part.pos);
                //console.log(gltf.scene.position);

                document.getElementById('div_progressbar_modeldl')!.setAttribute('hidden', '');
                scene.add(gltf.scene);

            }, function (xhr) {

                document.getElementById('progressbar_modeldl')!.setAttribute('style', 'width: ' + Math.floor(xhr.loaded / xhr.total * 100) + '%');

            }, function (error) {

                console.error(error);

            });
        }.bind(this));
    }


    //Update Article with Ajax
    async dbUpdEditProductArticleApi(updObject: any, token: string) {
        console.log(JSON.stringify(updObject));

        //データ更新
        //this.data_reflesh_without_model();

        //指定urlからデータを取得
        //fetch内の各引数は以下の通り。
        //第1引数は【アクションメソッドのPath】、
        //第2引数は【通信方法 例)Get または　Post】、
        //第3引数は【データの型】
        //サンプル例：fetch(Path,{method:"POST",body:formData})

        const response = await fetch(this.str_url_base_edit_product_article, { //【重要ポイント】「await」句は削除すること
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

    //dbUpdEditProductLightApi
    async dbUpdEditProductLightApi(updObject: any, token: string) {


        //console.log("dbUpdEditProductLightApi");
        console.log(updObject);
        const response = await fetch(this.str_url_base_edit_product_light, {
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

    //dbUpdEditProductInstanceApi
    async dbUpdEditProductInstanceApi(updObject: any, token: string) {

        console.log(updObject);
        const response = await fetch(this.str_url_base_edit_product_instance, {
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

