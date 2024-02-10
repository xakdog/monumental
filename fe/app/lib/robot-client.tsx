import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";

export type JointUpdate = {
  robotId: string;
  jointName: string;
  value: number;
};

type RobotContextType = {
  updateJoint: (robotId: string, jointName: string, value: number) => void;
  subscribeToRobot: (
    robotId: string,
    onJointUpdate: (update: JointUpdate) => void,
  ) => () => void;
};

const RobotContext = createContext<RobotContextType | undefined>(undefined);

export const RobotProvider: React.FC<PropsWithChildren<{ wsUrl: string }>> = ({
  children,
  wsUrl,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!wsUrl) return;

    const websocket = new WebSocket(wsUrl);
    websocket.onopen = () => {
      console.log("WebSocket connection established");
      setWs(websocket);
    };
    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      setWs(null);
      setTimeout(() => websocket.close(), 500);
    };
  }, [wsUrl]);

  const updateJoint = useCallback(
    (robotId: string, jointName: string, value: number) => {
      if (!ws) return;
      const message = JSON.stringify({
        type: "controlJoint",
        robotId,
        jointName,
        value,
      });
      ws.send(message);
    },
    [ws],
  );

  const subscribeToRobot = useCallback(
    (robotId: string, onJointUpdate: (update: JointUpdate) => void) => {
      if (!ws) return () => {};
      if (ws.readyState !== ws.OPEN) return () => {};

      const message = JSON.stringify({
        type: "subscribeToRobot",
        robotId,
      });
      ws.send(message);

      console.log("Subscribed to robot", robotId);

      const listener = (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        if (data.type === "jointUpdated" && data.robotId === robotId) {
          onJointUpdate({
            robotId: data.robotId,
            jointName: data.jointName,
            value: data.value,
          });
        }
      };

      ws.onmessage = listener;

      return () => {
        ws.onmessage = null;
      };
    },
    [ws],
  );

  return (
    <RobotContext.Provider value={{ updateJoint, subscribeToRobot }}>
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = (
  robotId: string,
  onJointUpdate: (update: JointUpdate) => void,
) => {
  const context = useContext(RobotContext);
  if (context === undefined) {
    throw new Error("useRobot must be used within a RobotProvider");
  }

  const updateJoint = useCallback(
    (jointName: string, value: number) => {
      context.updateJoint(robotId, jointName, value);
    },
    [context, robotId],
  );

  useEffect(() => {
    if (!robotId) return;
    const unsubscribe = context.subscribeToRobot(robotId, onJointUpdate);
    return unsubscribe;
  }, [context, robotId, onJointUpdate]);

  return { updateJoint };
};
