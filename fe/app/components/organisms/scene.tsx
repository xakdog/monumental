import React, { useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { Robot } from "~/components/molecules";
import { useRobot, JointUpdate } from "~/lib/robot-client";
import { CraneState } from "~/lib/robot-schema";

export const Scene: React.FC<{ state: CraneState }> = ({ state }) => {
  return (
    <Canvas style={{ background: "#1d1d1d" }}>
      <OrbitControls />

      <PerspectiveCamera
        makeDefault
        position={[-11, 10, 10]} // Adjust the camera position
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
        elevation={state.lift}
        swingAngle={state.swing}
        armAngle={state.arm}
        wristAngle={state.wrist}
        jawGap={state.jaw}
      />
    </Canvas>
  );
};

export const SceneLoader: React.FC<{
  robotId: string;
  onUpdate: (joint: string, value: number) => void;
}> = ({ robotId, onUpdate }) => {
  const onJointUpdate = useCallback(
    ({ jointName, value }: JointUpdate) => {
      onUpdate(jointName, value);
    },
    [onUpdate],
  );

  useRobot(robotId, onJointUpdate);

  return null;
};
