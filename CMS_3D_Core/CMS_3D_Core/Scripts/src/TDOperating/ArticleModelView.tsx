import * as React from 'react';
import { useRef } from 'react';

import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei'

import { Color } from 'three';
import { DirectionalLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


import { Aarticle, Instruction, ViewObject, InstancePart, Annotation, AnnotationDisplay, Light as TdLight, Refelencematerial } from '../tdarticle/tdarticle_Aarticle';
import { UseLight } from '../TDOperating/UseLight';



type Props = {
    id_part?: number;
    article?: Aarticle;
    instruction: Instruction[];
    instancepart: InstancePart[];
    light: TdLight[]
}


//this.camera_main = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 6350000);

export const ArticleModelView: React.VFC<Props> = ({ article, instruction, instancepart, light }) => {
    return (
        <div>
            <Canvas camera={{
                position: [20, 5, 5],
                fov: 45,
                aspect: 16 / 9,
                far: 6350000,
                zoom:1
            }}>
                <mesh>
                    {
                        instancepart.map(instancepart => <UseModel instancepart={instancepart} />)
                    }
                </mesh>
                {
                    light.map(light => <UseLight light={light} />)
                }
                <gridHelper args={[200, 200, `white`, `gray`]} />
                <OrbitControls />
            </Canvas>
        </div>
    );
}


type PropsPartModel = {
    instancepart: InstancePart;
}


const UseModel: React.VFC<PropsPartModel> = ({ instancepart }) => {

    console.log(instancepart);
    return (
        <React.Suspense fallback={null}>
            <LoadModel instancepart={instancepart} />
        </React.Suspense>
    )
}


const LoadModel: React.VFC<PropsPartModel> = ({ instancepart }) => {

    const str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";
    const str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: instancepart.id_part.toString() }).toString();
    console.log(str_url_partapi);

    const gltf = useLoader(GLTFLoader, str_url_partapi);



    gltf.scene.position.add(instancepart.pos);
    return (
        <primitive object={gltf.scene} dispose={null} />
    )
}

const Light = () => {
    const ref = useRef()
    useHelper(ref, DirectionalLightHelper, 1)

    return (
        <>
            <directionalLight
                ref={ref}
                intensity={0.6}
                position={[0, 2, 2]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                castShadow
            />
        </>
    )
}