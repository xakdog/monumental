import { RobotGripper } from "~/components/molecules/robot/robot-gripper";
import { RobotArm } from "./robot-arm";
import { RobotLift } from "./robot-lift";

type RobotProps = {
  swingAngle: number;
  elevation: number;
  armAngle: number;
  wristAngle: number;
  jawGap: number;
};

export const Robot: React.FC<RobotProps> = (props) => {
  return (
    <RobotLift elevation={props.elevation} swingAngle={props.swingAngle}>
      <RobotArm rotation={props.armAngle}>
        <RobotGripper jawGap={props.jawGap} wristAngle={props.wristAngle} />
      </RobotArm>
    </RobotLift>
  );
};
