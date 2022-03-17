import { useRef } from 'react';
import * as React from 'react';
import { ReactThreeFiber, extend, useThree, useFrame, Canvas } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Color } from 'three';

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
        <Canvas>
            <ambientLight intensity={1.0} color={new Color(0xffffff)} />
            <Controls isControl={true} />
            <mesh>
                <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                <meshNormalMaterial attach="material" />
            </mesh>
        </Canvas>
    );
}