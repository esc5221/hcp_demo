import React, { useState, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

const EyeTracker = ({}) => {
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const [smoothEyePosition, setSmoothEyePosition] = useState({ x: 0, y: 0 });
    const lerpFactor = 0.5;
    const { camera } = useThree();
    const webGazerRef = useRef(null);

    useEffect(() => {
        // if script doesnot exist, create it
        // if script exist, do nothing
        const script = document.createElement("script");
        script.src = "https://webgazer.cs.brown.edu/webgazer.js";
        script.async = true;

        document.body.appendChild(script);

        script.onload = () => {
            if (document.getElementById("webgazerVideoContainer")) {
                return;
            }
            console.log("webgazer loaded");
            webGazerRef.current = window.webgazer;
            webGazerRef.current
                .setGazeListener((data) => {
                    if (data) {
                        const middleEyeImagex =
                            (data.eyeFeatures.left.imagex + data.eyeFeatures.right.imagex) / 2;
                        const middleEyeImagey =
                            (data.eyeFeatures.left.imagey + data.eyeFeatures.right.imagey) / 2;
                        setEyePosition({
                            x: middleEyeImagex.toFixed(0),
                            y: middleEyeImagey.toFixed(0),
                        });
                    }
                })
                .begin();
            webGazerRef.current.applyKalmanFilter(true);
        };

        return () => {
            if (webGazerRef.current) {
                webGazerRef.current.end();
            }
            document.body.removeChild(script);
        };
    }, []);

    let count = 0;
    useFrame((state, delta) => {
        if (eyePosition.x === 0 && eyePosition.y === 0) {
            return;
        }

        const smoothX = smoothEyePosition.x + (eyePosition.x - smoothEyePosition.x) * lerpFactor;
        const smoothY = smoothEyePosition.y + (eyePosition.y - smoothEyePosition.y) * lerpFactor;
        setSmoothEyePosition({ x: smoothX, y: smoothY });

        const scale = {
            x: 1.5,
            y: 2,
        }

        const bound = {
            x: 140,
            y: 90,
        }

        const posX = -parseInt(smoothX) * scale.x + 320 * scale.x;
        const posY = -parseInt(smoothY) * scale.y + 240 * scale.y;
        camera.position.set(
            Math.min(Math.max(posX, -bound.x), bound.x),
            Math.min(Math.max(posY, -bound.y), bound.y),
            camera.position.z
        );

        // rotate camera
        // its Euler
        // if x changes, rotate around y
        // if y changes, rotate around x

        if (count % 100 === 0) {
            // console.log("position", camera.position);
            // console.log("rotate", camera.rotation);
            // console.log("camera", camera);
            count++;
        }
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
    });

    return <></>;
};

export { EyeTracker };
