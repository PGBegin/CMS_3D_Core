import * as React from 'react';
import { useRef } from 'react';
import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { Color } from 'three';
import { OrbitControls, useHelper } from '@react-three/drei'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'





type Props = {
    id_part?: number;
}
export const ModelFileView: React.VFC<Props> = ({ id_part}) => {
    return (
        <div>
            <Canvas>
                <ambientLight intensity={1.0} color={new Color(0xffffff)} />

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

