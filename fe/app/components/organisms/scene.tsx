import React, { useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { Robot } from "~/components/molecules";
import { useRobot, JointUpdate } from "~/lib/robot-client";
import { CraneState, CRANE_JOINTS } from "~/lib/robot-schema";

export const Scene: React.FC<{ robotId: string }> = ({ robotId }) => {
  const [state, setState] = useState<CraneState>({
    swing: 0,
    lift: 0,
    arm: 0,
    wrist: 0,
    jaw: 0,
  });

  const onJointUpdate = useCallback(({ jointName, value }: JointUpdate) => {
    if (!CRANE_JOINTS.includes(jointName)) return;

    setState((state) => ({ ...state, [jointName]: value }));
  }, []);

  const robot = useRobot(robotId, onJointUpdate);

  // if (globalThis) {
  //   globalThis.robot = robot;
  // }

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
        elevation={state.lift}
        swing={state.swing}
        armAngle={state.arm}
        wristAngle={state.wrist}
        jawGap={state.jaw}
      />
    </Canvas>
  );
};
