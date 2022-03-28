import * as React from 'react';
import { useRef } from 'react';

import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei'

import { Color } from 'three';
import { DirectionalLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


import { useState, useEffect } from "react";

import * as ReactDOM from 'react-dom'

import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';

import { ModelFileView } from "../TDOperating/ModelFileView";
import { ArticleModelView } from "../TDOperating/ArticleModelView";
import { ModelFileView2 } from "../test/AnimationTest";

import { Aarticle, Instruction, ViewObject, InstancePart, Annotation, AnnotationDisplay, Refelencematerial, Light } from '../tdarticle/tdarticle_Aarticle';



export const ArticleDetails = () => {

    const { id } = useParams();

    const [str_url_getapi, setStr_url_getapi] = useState("/ContentsOperatorForArticleApis/GetArticleObjectWholeData?" + new URLSearchParams({ id_article: id!.toString() }).toString());

    const [loading, setLoading] = useState(true);

    const [article, setArticle] = useState<Aarticle>();
    const [view_object, setView_object] = useState<ViewObject[]>([]);
    const [instruction, setInstruction] = useState<Instruction[]>([]);
    const [instancepart, setInstancePart] = useState<InstancePart[]>([]);
    const [annotation, setAnnotation] = useState<Annotation[]>([]);
    const [annotation_display, setAnnotation_display] = useState<AnnotationDisplay[]>([]);
    const [light, setLight] = useState<Light[]>([]);
    const [refelencematerial, setRefelencematerial] = useState<Refelencematerial[]>([]);

    useEffect(() => {
        const DataLoading = async () => {
            const response = await fetch(str_url_getapi);
            const data = await response.json();

            //console.log(data);

            let article_temp: Aarticle;
            let view_object_temp: ViewObject[] = [];
            let instruction_temp: Instruction[] = [];
            let instancepart_temp: InstancePart[] = [];
            let annotation_temp: Annotation[] = [];
            let annotation_display_temp: AnnotationDisplay[] = [];
            let light_temp: Light[] = [];
            let refelencematerial_temp: Refelencematerial[] = [];


            for (let i in data) {
                if (data[i].type == "article") {
                    // 処理が成功した場合に取得されるJSONデータ
                    article_temp = new Aarticle(
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
                }
                
                if (data[i].type == "view") {
                    view_object_temp.push(new ViewObject(

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

                    instruction_temp.push(new Instruction(
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

                    //instancepart_temp[data[i].id_inst] = new InstancePart(
                    instancepart_temp.push( new InstancePart(
                        data[i].id_assy,
                        data[i].id_inst,
                        data[i].id_part,
                        data[i].pos_x,
                        data[i].pos_y,
                        data[i].pos_z,
                        null));
                }

                
                if (data[i].type == "annotation") {
                    annotation_temp.push(new Annotation(

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
                    annotation_display_temp.push(new AnnotationDisplay(

                        data[i].id_article,
                        data[i].id_instruct,
                        data[i].id_annotation,
                        data[i].is_display,
                        data[i].is_display_description
                    ));
                }

                
                if (data[i].type == "light") {
                    light_temp.push(new Light(
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
                    refelencematerial_temp.push(new Refelencematerial(
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

            setArticle(article_temp!);
            setView_object(view_object_temp);
            setInstruction(instruction_temp);
            setInstancePart(instancepart_temp);
            setAnnotation(annotation_temp);
            setAnnotation_display(annotation_display_temp);
            setLight(light_temp);
            setRefelencematerial(refelencematerial_temp);

            setLoading(false);
        };
        DataLoading();
    }, []
    );


    const renderBlock = () => {
        console.log(instruction);
        console.log(instancepart);
        return (
            <>


                <div className="row" id="id_div_row_article">

                    <div className="col-6" id="id_contents_models" style={{ position: 'relative' }} >


                        <div id="annotations"></div>
                        <canvas id="model_screen">
                        </canvas>


                        <div className="row" id="model_screen" style={{ width: 640, height: 360 }}>
                            {
                               // <ModelFileView id_part={instancepart[0].id_part} />
                            }
                            {
                                <ArticleModelView article={article} instruction={[]} instancepart={instancepart} light={ light }/>
                            }
                        </div>


                        <div className="progress" id="div_progressbar_modeldl">
                            {
                                <div className="progress-bar" role="progressbar" style={{ width: '0%' }} id="progressbar_modeldl"></div>
                                //<div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" id="progressbar_modeldl"></div>
                            }
                        </div>
                        <hr />

                        <div id="control_panel_zone">
                        </div>

                        <hr />


                    </div>


                    <div className="col-6" id="id_contents_instructions">
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a className="nav-link active" id="nav-instruction-tab" data-bs-toggle="tab" href="#nav-instruction">Instruction</a>
                                <a className="nav-link" id="nav-materials-tab" data-bs-toggle="tab" href="#nav-materials">Materials</a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">



                            <div className="tab-pane fade show active" id="nav-instruction">

                                <div className="overflow-auto" id="preview_instruction_short_description"></div>

                            </div>

                            <div className="tab-pane fade" id="nav-materials">

                                <h4>Materials</h4>

                                <table className="table" id="id_view_refelencematerial_table">
                                    <thead id="id_view_refelencematerial_table_thead">
                                        <tr>
                                            <th>
                                                Part Number
                                            </th>
                                            <th>
                                                File Name
                                            </th>
                                            <th>
                                                File Size
                                            </th>
                                            <th>
                                                Item Link
                                            </th>
                                            <th>
                                                Author
                                            </th>
                                            <th>
                                                License
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="id_view_refelencematerial_table_tbody">
                                    </tbody>
                                </table>




                            </div>
                        </div>


                    </div>

                </div>

            </>
        );


    };
    return (
        loading
            ? <p><em>Loading...</em></p>
            : renderBlock()

    );
}
