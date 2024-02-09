import React from "react";
import { Canvas } from "@react-three/fiber";
import { Robot } from "~/components/molecules";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export const Scene: React.FC = () => {
  return (
    <Canvas style={{ background: "#1d1d1d" }}>
      <OrbitControls />

      <PerspectiveCamera
        makeDefault
        position={[-10, 10, 10]} // Adjust the camera position
        fov={75} // Field of view
        near={0.1}
        far={100}
      />

      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />

      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <gridHelper args={[50, 25]} />

      <Robot
        elevation={2.38}
        swing={0}
        armAngle={-0.640535835481919}
        wristAngle={-0.6136577650012062}
        jawGap={0}
      />
    </Canvas>
  );
};
