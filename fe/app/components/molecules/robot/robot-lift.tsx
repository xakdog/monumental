import React, { PropsWithChildren } from "react";

export type RobotLiftProps = PropsWithChildren<{
  elevation: number;
  swingAngle: number;
}>;

const BASE_HEIGHT = 8.8;
const BASE_WIDTH = 0.68;
const BASE_DEPTH = 0.6;

export const BOOM_WIDTH = 1.12;
export const BOOM_DEPTH = 2.5;
const BOOM_Z_SHIFT = 0.1 + (BOOM_DEPTH + BASE_DEPTH) / 2;

export const RobotLift: React.FC<RobotLiftProps> = ({
  children,
  elevation,
  swingAngle,
}) => {
  return (
    <mesh
      castShadow
      receiveShadow
      name="base"
      rotation={[0, swingAngle, 0]}
      position={[0, BASE_HEIGHT / 2, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        position={[0, elevation, BOOM_Z_SHIFT]}
        name="boom"
      >
        {children}
        <boxGeometry args={[BOOM_WIDTH, BASE_WIDTH, BOOM_DEPTH]} />
        <meshStandardMaterial />
      </mesh>
      <boxGeometry args={[BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};
