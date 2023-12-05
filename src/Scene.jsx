import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function OpenedRoom({ scale = 10, width = 1, height = 1, depth = 1, ...props }) {
    const ref = useRef();

    useFrame(() => {
        // Optional: Add animations or interactions here
    });

    // Dimensions of the room
    const wallWidth = 0.002;
    const wallSize = [width, height, depth];

    return (
        <group {...props} ref={ref} scale={scale}>
            {/* Floor */}
            <mesh position={[0, -height / 2, 0]}>
                <boxGeometry args={[wallSize[0], wallWidth, wallSize[2]]} />
                <meshStandardMaterial color="#555566" />
            </mesh>

            {/* Ceiling */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[wallSize[0], wallWidth, wallSize[2]]} />
                <meshStandardMaterial color="gray" />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[wallSize[2], wallSize[1], wallWidth]} />
                <meshStandardMaterial color="#98B4D4" />
            </mesh>

            {/* Right Wall */}
            <mesh position={[width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[wallSize[2], wallSize[1], wallWidth]} />
                <meshStandardMaterial color="#98B4D4" />
            </mesh>

            {/* Back Wall */}
            <mesh position={[0, 0, -depth / 2]}>
                <boxGeometry args={[wallSize[0], wallSize[1], wallWidth]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>

            {/* Front Wall (Open) */}
            {/* Omitted to create an open side */}
        </group>
    );
}

export function Box({ scale = 1, autorotate = true, ...props }) {
    const ref = useRef();
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);
    useFrame((state, delta) => {
        if (autorotate) {
            ref.current.rotation.x = ref.current.rotation.y += delta;
        }
    });
    return (
        <mesh
            {...props}
            ref={ref}
            scale={(clicked ? 1.5 : 1) * scale}
            onClick={() => click(!clicked)}
            onPointerOver={(event) => (event.stopPropagation(), hover(true))}
            onPointerOut={(event) => hover(false)}
        >
            <boxGeometry />
            <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
        </mesh>
    );
}
