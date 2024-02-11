import { ControlInput } from "~/components/molecules/index";
import { useRobot } from "~/lib/robot-client";
import { CraneState } from "~/lib/robot-schema";
import "./panel.css";

type PanelProps = {
  robotId: string;
  state: CraneState;
  onPreview: (joint: string, value: number) => void;
};

export const Panel: React.FC<PanelProps> = ({ robotId, state, onPreview }) => {
  const robot = useRobot(robotId);

  if (!robot.ready) {
    return null;
  }

  // Ideally you want to have a schema for the robot. This structure is hardcoded to save time.
  return (
    <div className="location-panel">
      <ControlInput
        label="Swing"
        unit="°"
        value={state.swing}
        onPreview={(value) => onPreview("swing", value)}
        onChange={(value) => robot.updateJoint("swing", value)}
      />

      <ControlInput
        label="Elevation"
        unit="cm"
        value={state.lift}
        min={0}
        max={150}
        onPreview={(value) => onPreview("lift", value)}
        onChange={(value) => robot.updateJoint("lift", value)}
      />

      <ControlInput
        label="Arm"
        unit="°"
        value={state.arm}
        onPreview={(value) => onPreview("arm", value)}
        onChange={(value) => robot.updateJoint("arm", value)}
      />

      <ControlInput
        label="Wrist"
        unit="°"
        value={state.wrist}
        onPreview={(value) => onPreview("wrist", value)}
        onChange={(value) => robot.updateJoint("wrist", value)}
      />

      <ControlInput
        label="Gripper"
        unit="cm"
        value={state.jaw}
        decimals={2}
        min={0}
        max={10}
        onPreview={(value) => onPreview("jaw", value)}
        onChange={(value) => robot.updateJoint("jaw", value)}
      />
    </div>
  );
};
