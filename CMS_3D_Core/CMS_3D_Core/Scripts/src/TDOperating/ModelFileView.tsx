import * as React from 'react';
import { useRef } from 'react';

import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei'

import { Color } from 'three';
import { DirectionalLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'





type Props = {
    id_part?: number;
}


export const ModelFileView: React.VFC<Props> = ({ id_part}) => {
    return (
        <div>
            <Canvas camera={{
                position: [20, 5, 5]
            }}>
                <ambientLight intensity={1.0} color={new Color(0xffffff)} />
                <directionalLight intensity={0.6} position={[0, 2, 2]}   />
                <mesh>


                    {   
                        <UseModel id_part={id_part}  />
                    }
                </mesh>
                <OrbitControls />
            </Canvas>
        </div>
    );
}

const UseModel: React.VFC<Props> = ({ id_part }) => {
    return (
        <React.Suspense fallback={null}>
            <LoadModel id_part={id_part} />
        </React.Suspense>
    )
}


const LoadModel: React.VFC<Props> = ({ id_part }) => {

    const str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";
    const str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: id_part!.toString() }).toString();
    console.log(str_url_partapi);

    const gltf = useLoader(GLTFLoader, str_url_partapi);
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