import { useState } from "react";
import { CubeTransparentIcon, WrenchIcon } from "@heroicons/react/24/outline";
import { ControlInput } from "~/components/molecules/index";
import { useRobot, useErrors } from "~/lib/robot-client";
import { CraneState } from "~/lib/robot-schema";
import "./panel.css";

type Mode = "direct" | "IK";
type JointCallback = (joint: string, value: number) => void;

type PanelProps = {
  robotId: string;
  state: CraneState;
  onPreview: JointCallback;
};

const noop = () => {};

export const Panel: React.FC<PanelProps> = ({ robotId, state, onPreview }) => {
  const robot = useRobot(robotId);

  const [mode, setMode] = useState<Mode>("direct");

  if (!robot.ready) {
    return null;
  }

  return (
    <div className="location-panel">
      <ModeSwitch mode={mode} onChange={setMode} />

      {mode === "direct" ? (
        <DirectManipulation
          state={state}
          onPreview={onPreview}
          updateJoint={robot.updateJoint}
        />
      ) : (
        <InverseKinematics />
      )}
    </div>
  );
};

const ModeSwitch: React.FC<{ mode: Mode; onChange(mode: Mode): void }> = ({
  mode,
  onChange,
}) => (
  <div className="location-panel__mode-selector">
    <WrenchIcon
      data-selected={mode === "direct"}
      onClick={() => onChange("direct")}
      title="Direct manipulation - you can adjust each actuator separately"
    />
    <CubeTransparentIcon
      data-selected={mode === "IK"}
      onClick={() => onChange("IK")}
      title="Inverse kinematics - calculate joints position by coordinate"
    />
  </div>
);

const DirectManipulation: React.FC<{
  state: CraneState;
  onPreview: JointCallback;
  updateJoint: JointCallback;
}> = ({ state, onPreview, updateJoint }) => (
  // Ideally you want to have a schema for the robot. This structure is hardcoded to save time.
  <>
    <ControlInput
      label="Swing"
      unit="°"
      value={state.swing}
      onPreview={(value) => onPreview("swing", value)}
      onChange={(value) => updateJoint("swing", value)}
    />

    <ControlInput
      label="Elevation"
      unit="cm"
      value={state.lift}
      min={0}
      max={150}
      onPreview={(value) => onPreview("lift", value)}
      onChange={(value) => updateJoint("lift", value)}
    />

    <ControlInput
      label="Arm"
      unit="°"
      value={state.arm}
      onPreview={(value) => onPreview("arm", value)}
      onChange={(value) => updateJoint("arm", value)}
    />

    <ControlInput
      label="Wrist"
      unit="°"
      value={state.wrist}
      onPreview={(value) => onPreview("wrist", value)}
      onChange={(value) => updateJoint("wrist", value)}
    />

    <ControlInput
      label="Gripper"
      unit="cm"
      value={state.jaw}
      decimals={2}
      min={0}
      max={10}
      onPreview={(value) => onPreview("jaw", value)}
      onChange={(value) => updateJoint("jaw", value)}
    />
  </>
);

const InverseKinematics: React.FC = () => {
  const errors = useErrors();

  return (
    <>
      <ControlInput
        label="Position X"
        unit="m"
        value={0}
        onPreview={noop}
        onChange={() => errors.show("Inverse Kinematics: service unavailable")}
      />

      <ControlInput
        label="Y"
        unit="m"
        value={0}
        onPreview={noop}
        onChange={() => errors.show("Inverse Kinematics: service unavailable")}
      />

      <ControlInput
        label="Z"
        unit="m"
        value={0}
        onPreview={noop}
        onChange={() => errors.show("Inverse Kinematics: service unavailable")}
      />
    </>
  );
};
