import * as React from 'react';
import { useRef } from 'react';
import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Color } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

extend({ OrbitControls });

// インターフェイスIntrinsicElementsにorbitControls の定義を追加
declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Node<OrbitControls, typeof OrbitControls>
        }
    }
}

type ControlProps = {
    isControl: boolean;
}

export const Controls: React.FC<ControlProps> = (props) => {
    const controlsRef = useRef<OrbitControls>();
    const { camera, gl } = useThree();

    useFrame(() => {
        controlsRef.current?.update();
    });

    return (
        <orbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enabled={props.isControl}
            enableZoom={true}
            zoomSpeed={1.0}
            enableRotate={true}
            rotateSpeed={1.0}
            enablePan={true}
            panSpeed={2.0}
            minDistance={0}
            maxDistance={Infinity}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
        />
    );
}

type Props = {
    id_part?: number;
}
export const ModelFileView: React.VFC<Props> = ({ id_part}) => {
    return (
        <div>
            <Canvas>
                <ambientLight intensity={1.0} color={new Color(0xffffff)} />
                <Controls isControl={true} />
                <mesh>
                    {
                        //<boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                        //<meshNormalMaterial attach="material" />
                    }

                    {   
                        <UseModel id_part={id_part}  />
                    }
                </mesh>
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

