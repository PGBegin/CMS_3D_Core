//

import * as THREE from 'three';




export class Aarticle {
    id_article: number;
    id_assy: number;

    title: string;
    short_description: string;
    long_description: string;
    meta_description: string;
    meta_category: string;

    status: number;

    directional_light_color: number;
    directional_light_intensity: number;
    directional_light_px: number;
    directional_light_py: number;
    directional_light_pz: number;

    ambient_light_color: number;
    ambient_light_intensity: number;

    gammaOutput: boolean;

    id_attachment_for_eye_catch: number;

    bg_c: number;
    bg_h: number;
    bg_s: number;
    bg_l: number;

    constructor(id_article: number, id_assy: number, title: string, short_description: string, long_description: string, meta_description: string, meta_category: string, status: number
        , directional_light_color: number, directional_light_intensity: number, directional_light_px: number, directional_light_py: number, directional_light_pz: number
        , ambient_light_color: number, ambient_light_intensity: number, gammaOutput: boolean, id_attachment_for_eye_catch: number,
        bg_c: number, bg_h: number, bg_s: number, bg_l: number
    ) {

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

        this.id_attachment_for_eye_catch = id_attachment_for_eye_catch;

        this.bg_c = bg_c;
        this.bg_h = bg_h;
        this.bg_s = bg_s;
        this.bg_l = bg_l;

    }
}



export class Instruction {

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



export class ViewObject {

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


    constructor(
        id_article: number, id_view: number,
        title: string,
        cam_pos_x: number, cam_pos_y: number, cam_pos_z: number,
        cam_lookat_x: number, cam_lookat_y: number, cam_lookat_z: number,
        cam_quat_x: number, cam_quat_y: number, cam_quat_z: number, cam_quat_w: number,
        obt_target_x: number, obt_target_y: number, obt_target_z: number) {

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

export class InstancePart {

    id_assy: number;
    id_inst: number;
    id_part: number;
    pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    objectdata: any;


    constructor(id_assy: number, id_inst: number, id_part: number, pos_x: number, pos_y: number, pos_z: number, objectdata: any) {
        this.id_assy = id_assy;
        this.id_inst = id_inst;
        this.id_part = id_part;

        this.pos.set(pos_x, pos_y, pos_z);

        this.objectdata = objectdata;
    }
}

export class Annotation {
    id_article: number;
    id_annotation: number;

    title: string;
    description1: string;
    description2: string;

    status: number;

    pos_pointing: THREE.Vector3;

    web_id_annotation: string;
    web_id_annotation_description: string;
    marker!: THREE.Mesh;
    arrow!: THREE.ArrowHelper;
    axisHelper!: THREE.AxesHelper;

    is_display_annotation: boolean = true;

    constructor(id_article: number, id_annotation: number,
        title: string, description1: string, description2: string, status: number,
        pos_x: number, pos_y: number, pos_z: number, web_id_annotation: string, web_id_annotation_description: string) {

        this.id_article = id_article;
        this.id_annotation = id_annotation;

        this.title = title;
        this.description1 = description1;
        this.description2 = description2;
        this.status = status;

        this.pos_pointing = new THREE.Vector3(pos_x, pos_y, pos_z);
        this.web_id_annotation = web_id_annotation;
        this.web_id_annotation_description = web_id_annotation_description;
        //this.marker = null;

        this.axisHelper = new THREE.AxesHelper(0.4);
        this.axisHelper.position.copy(this.pos_pointing);
        this.axisHelper.visible = false;
    }
}




export class AnnotationDisplay {
    id_article: number;
    id_instruct: number;
    id_annotation: number;
    is_display: boolean;
    is_display_description: boolean;

    constructor(id_article: number, id_instruct: number, id_annotation: number, is_display: boolean, is_display_description: boolean) {
        this.id_article = id_article;
        this.id_instruct = id_instruct;
        this.id_annotation = id_annotation;
        this.is_display = is_display;
        this.is_display_description = is_display_description;
    }
}


export class Light {
    id_article: number;
    id_light: number;
    light_type: string;
    title!: string;
    short_description!: string;
    color!: number;
    intensity!: number;
    px!: number;
    py!: number;
    pz!: number;
    distance!: number;
    decay!: number;
    power!: number;
    shadow!: number;
    tx!: number;
    ty!: number;
    tz!: number;
    skycolor!: number;
    groundcolor!: number;
    is_lensflare: boolean;
    lfsize!: number;
    file_data!: any;

    light_object!: any;



    constructor(
        id_article: number,
        id_light: number,
        light_type: string,
        title: string,
        short_description: string,
        color: number,
        intensity: number,
        px: number,
        py: number,
        pz: number,
        distance: number,
        decay: number,
        power: number,
        shadow: number,
        tx: number,
        ty: number,
        tz: number,
        skycolor: number,
        groundcolor: number,
        is_lensflare: boolean,
        lfsize: number) {

        this.id_article = id_article;
        this.id_light = id_light;
        this.light_type = light_type;


        this.light_type = light_type;
        this.title = title;
        this.short_description = short_description;
        this.color = color;
        this.intensity = intensity;
        this.px = px;
        this.py=py;
        this.pz=pz;
        this.distance = distance;
        this.decay = decay;
        this.power = power;
        this.shadow = shadow;
        this.tx = tx;
        this.ty=ty;
        this.tz=tz;
        this.skycolor = skycolor;
        this.groundcolor = groundcolor;
        this.is_lensflare = is_lensflare;
        this.lfsize = lfsize;
        //this.file_data!: any;
    }
}



export class Refelencematerial {

    id_assy: number;
    id_inst: number;
    id_part: number;
    model_name: string;
    file_name: string;
    file_length: number;
    itemlink: string;
    author: string;
    license: string;

    constructor(id_assy: number, id_inst: number, id_part: number, model_name: string, file_name: string, file_length: number, itemlink: string, author: string, license: string) {
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
