import React from "react";

const JAW_COLOR = "#f84444";
const GRIPPER_WIDTH = 0.42;

const GripperBase: React.FC = () => (
  <mesh
    castShadow
    receiveShadow
    position={[0, -0.56, 0.76]}
    scale={[GRIPPER_WIDTH, 0.12, 1.7]}
  >
    <boxGeometry morphTargetsRelative={false} />
    <meshStandardMaterial />
  </mesh>
);

const GripperJaw: React.FC = () => (
  <mesh castShadow receiveShadow position={[0, -0.72, 1.44]}>
    <boxGeometry
      args={[GRIPPER_WIDTH, 0.2, 0.04]}
      morphTargetsRelative={false}
    />
    <meshStandardMaterial color={JAW_COLOR} />
  </mesh>
);

type GripperActuatorProps = {
  jawShift: number;
};

const GripperActuator: React.FC<GripperActuatorProps> = ({ jawShift }) => (
  <mesh castShadow receiveShadow position={[0, -0.44, jawShift]}>
    <mesh castShadow receiveShadow position={[0, -0.18, 0.62]}>
      <boxGeometry
        args={[GRIPPER_WIDTH, 0.4, 0.04]}
        morphTargetsRelative={false}
      />
      <meshStandardMaterial color={JAW_COLOR} />
    </mesh>
    <boxGeometry
      args={[GRIPPER_WIDTH, 0.06, 1.38]}
      morphTargetsRelative={false}
    />
    <meshStandardMaterial />
  </mesh>
);

export type RobotGripperProps = {
  jawGap: number;
  wristAngle: number;
};

export const RobotGripper: React.FC<RobotGripperProps> = ({
  jawGap,
  wristAngle,
}) => {
  const jawZ = 1.01 + jawGap / 10;

  return (
    <mesh
      name="effector"
      position={[0, 0.12, 1]}
      rotation={[0, (wristAngle * Math.PI) / 180, 0]}
    >
      <GripperBase />
      <GripperJaw />
      <GripperActuator jawShift={jawZ} />
    </mesh>
  );
};
