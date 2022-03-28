import * as React from 'react';
import { useRef } from 'react';

import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei'

import { Color, PointLight, TextureLoader } from 'three';
import { DirectionalLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare';

import { Aarticle, Instruction, ViewObject, InstancePart, Annotation, AnnotationDisplay, Light as TdLight, Refelencematerial } from '../tdarticle/tdarticle_Aarticle';


type PropsPartModel = {
    light: TdLight;
}


export const UseLight: React.VFC<PropsPartModel> = ({ light }) => {



    if (light.light_type == "DirectionalLight") {

        return (
            <React.Suspense fallback={null}>
                <directionalLight intensity={light.intensity} color={light.color} position={[light.px, light.py, light.pz]} />
            </React.Suspense>
        )

        


    }
    else if (light.light_type == "AmbientLight") {
        return (
            <React.Suspense fallback={null}>
                <ambientLight intensity={light.intensity} color={new Color(light.color)} />
            </React.Suspense>
        )
    }
        
    else if (light.light_type == "PointLight") {
        // light
        let light_object = new PointLight(light.color, light.intensity, light.distance, light.decay);
        light_object.position.set(light.px, light.py, light.pz);
        //this.scene.add(obj_light.light_object);

        /*
         //レンズフレアがあった場合の処理。(上手くいかないのでコメントアウトしてある)
        if (light.is_lensflare) {
            // lensflares
            const textureLoader = new TextureLoader();


            //path of png file
            const path_lf_png = "/ContentsEditAttachment/GetAttachmentFile/28";
            const textureFlare0 = textureLoader.load(path_lf_png);


            const lensflare = new Lensflare();
            lensflare.addElement(new LensflareElement(textureFlare0, light.lfsize, 0, light.light_object.color));
            light_object.add(lensflare);

            <pointLight intensity={light.intensity} color={new Color(light.color)} distance={light.distance} decay={light.decay} position={[light.px, light.py, light.pz]} add({ lensflare = lensflare }) />
            //-------------------------------------------------------------
                
            return (
                <React.Suspense fallback={null}>
                    {light_object}
                </React.Suspense>
            )

        }
        */


        return (
            <React.Suspense fallback={null}>
                <pointLight intensity={light.intensity} color={new Color(light.color)} distance={light.distance} decay={light.decay} position={[light.px, light.py, light.pz]} />
            </React.Suspense>
        )

    }

    return (
        <React.Suspense fallback={null}>
            <ambientLight intensity={1.0} color={new Color(0xffffff)} />
            <directionalLight intensity={0.6} position={[0, 2, 2]} />
        </React.Suspense>
    )
}