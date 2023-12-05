import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import * as THREE from "three";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { CameraControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { OpenedRoom, Box } from "./Scene";
import { EyeTracker } from "./Webgazer";

function App() {
    const containerRef = useRef();
    const [aspect, setAspect] = useState(1);

    useEffect(() => {
        setAspect(containerRef.current.clientWidth / containerRef.current.clientHeight);
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
            <Canvas flat>
                <EyeTracker />
                <CameraControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.6} />
                <ambientLight intensity={Math.PI / 2} />
                <group scale={20} position={[5, -11, -5]}>
                    <Box position={[-0.1, 1.4, -10]} scale={0.5} />
                    <Box position={[-0.1, 1.4, -20]} scale={0.5} />
                    <Box position={[-0.1, 1.4, -30]} scale={0.5} />
                    <OpenedRoom position={[0, 0.5, 0]} width={aspect} height={1} depth={10} />
                    <pointLight position={[1, 1, 1]} />
                </group>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <Environment preset="city" background blur={1} />
            </Canvas>
        </div>
    );
}

export default App;
