﻿import { useRef } from 'react';
import * as React from 'react';
import { ReactThreeFiber, extend, useThree, useFrame, Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Color } from 'three';

//import { Canvas, useLoader } from 'react-three-fiber'
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


export function OrbitControlsTest() {
    return (
        <div>
            <Canvas>
                <ambientLight intensity={1.0} color={new Color(0xffffff)} />
                <Controls isControl={true} />
                <mesh>
                    <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                    <meshNormalMaterial attach="material" />

                    {
                        <UseModel />
                    }
                </mesh>
                </Canvas>
        </div>
    );
}

const UseModel = () => {
    return (
        <React.Suspense fallback={null}>
            <LoadModel />
        </React.Suspense>  
    )
}


//        var str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";
const LoadModel = () => {

    const str_url_partapi_base = "/ContentsOperatorForArticleApis/GetPartObjectFile?";
    const str_url_partapi = str_url_partapi_base + new URLSearchParams({ id_part: "3" }).toString();
    console.log(str_url_partapi);

    const gltf = useLoader(GLTFLoader, str_url_partapi);
//    const gltf = useLoader(GLTFLoader, "/ContentsOperatorForArticleApis/GetPartObjectFile?id_part=3")
//    const gltf = useLoader(GLTFLoader, "/sample.glb")
    return (
        <primitive object={gltf.scene} dispose={null} />
    )
}


export function OrbitControlsTest2() {
    return React.createElement("div", { style: { width: 720, height: 720 } }
        , React.createElement(Canvas, null, React.createElement("ambientLight", { intensity: 1.0, color: new Color(0xffffff) }), React.createElement(Controls, {
        isControl: true
    }), React.createElement("mesh", null, React.createElement("boxBufferGeometry", {
        attach: "geometry",
        args: [1, 1, 1]
    }), React.createElement("meshNormalMaterial", {
        attach: "material"
    }))));
}