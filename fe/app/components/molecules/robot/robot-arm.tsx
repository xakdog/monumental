import { PropsWithChildren } from "react";
import { BOOM_WIDTH } from "./robot-lift";

type RobotArmProps = PropsWithChildren<{
  rotation: number;
}>;

const ARM_WIDTH = 0.78;
const ARM_HEIGHT = 0.49;
const ARM_DEPTH = 2.92;

const ARM_Z_INTERSECTION = 0.2;
const ARM_Z_SHIFT = BOOM_WIDTH - ARM_Z_INTERSECTION;

const ARM_Y_PIVOT = -0.68;
const ARM_Z_PIVOT = ARM_DEPTH / 2 - ARM_Z_INTERSECTION;

export const RobotArm: React.FC<RobotArmProps> = ({ children, rotation }) => {
  return (
    <mesh name="arm" position={[0, 0, ARM_Z_SHIFT]} rotation={[0, rotation, 0]}>
      <mesh
        castShadow
        receiveShadow
        position={[0, ARM_Y_PIVOT, ARM_Z_PIVOT]}
        name="inner-arm"
      >
        {children}

        <boxGeometry args={[ARM_WIDTH, ARM_HEIGHT, ARM_DEPTH]} />
        <meshStandardMaterial />
      </mesh>
    </mesh>
  );
};
