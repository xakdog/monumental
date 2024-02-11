import React, {
  createContext,
  useEffect,
  useCallback,
  PropsWithChildren,
  useRef,
  useContext,
  useState,
} from "react";
import { ReadyState } from "react-use-websocket";
import { useWebSocket } from "./use-websocket-fix";

export type JointUpdate = {
  robotId: string;
  jointName: string;
  value: number;
};

type RobotContextType = {
  readyState: ReadyState;
  error: string;
  setError: (error: string) => void;
  updateJoint: (robotId: string, jointName: string, value: number) => void;
  subscribeToRobot: (
    robotId: string,
    onJointUpdate: (update: JointUpdate) => void,
  ) => () => void;
};

const RobotContext = createContext<RobotContextType | undefined>(undefined);

type RobotId = string;
type UpdateSubscription = (upd: JointUpdate) => void;

export class RobotSubscriptions {
  private subscriptions: Map<RobotId, UpdateSubscription[]> = new Map();

  public has(robotId: RobotId) {
    return this.subscriptions.has(robotId);
  }

  public subscribe(robotId: RobotId, callback: UpdateSubscription) {
    if (!this.subscriptions.has(robotId)) {
      this.subscriptions.set(robotId, []);
    }

    this.subscriptions.get(robotId)?.push(callback);
  }

  public unsubscribe(robotId: RobotId, callback: UpdateSubscription) {
    const updated =
      this.subscriptions.get(robotId)?.filter((sub) => sub !== callback) || [];

    this.subscriptions.set(robotId, updated);
  }

  public notify(robotId: RobotId, jointName: string, value: number) {
    this.subscriptions
      .get(robotId)
      ?.forEach((sub) => sub({ robotId, jointName, value }));
  }
}

export const RobotProvider: React.FC<PropsWithChildren<{ wsUrl: string }>> = ({
  children,
  wsUrl,
}) => {
  const [error, setError] = useState("");
  const subs = useRef(new RobotSubscriptions()).current;
  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    shouldReconnect: (closeEvent) => true, // Will attempt to reconnect on all close events
    reconnectInterval: 3000,
    reconnectAttempts: 10,
  });

  const sendJsonMessage = useCallback(
    <T,>(message: T) => sendMessage(JSON.stringify(message)),
    [sendMessage],
  );

  const updateJoint = useCallback(
    (robotId: string, jointName: string, value: number) =>
      sendJsonMessage({
        type: "controlJoint",
        robotId,
        jointName,
        value,
      }),
    [sendJsonMessage],
  );

  useEffect(() => {
    if (!lastMessage) return;
    // Ideally we need a TS type / zod schema for the message structure
    // we will skip it for this assignment
    const data = JSON.parse(lastMessage.data);

    if (data.type === "subscribed") {
      console.log("Subscribed to robot", data.robotId);
    }

    if (data.type === "jointUpdated") {
      subs.notify(data.robotId, data.jointName, data.value);
    }

    if (data.error === "Robot not found") {
      console.error("Robot not found", data.robotId);
      window.location.href = "/robot-not-found";
    }
  }, [lastMessage]);

  const subscribeToRobot = useCallback(
    (robotId: string, onJointUpdate: (update: JointUpdate) => void) => {
      if (!subs.has(robotId)) {
        sendJsonMessage({
          type: "subscribeToRobot",
          robotId,
        });
      }

      subs.subscribe(robotId, onJointUpdate);

      return () => {
        subs.unsubscribe(robotId, onJointUpdate);
      };
    },
    [sendJsonMessage],
  );

  return (
    <RobotContext.Provider
      value={{ updateJoint, subscribeToRobot, readyState, error, setError }}
    >
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = (
  robotId: string,
  onJointUpdate?: (update: JointUpdate) => void,
) => {
  const context = useContext(RobotContext);

  if (context === undefined) {
    throw new Error("useRobot must be used within a RobotProvider");
  }

  const isReady = context.readyState === ReadyState.OPEN;

  const updateJoint = useCallback(
    (jointName: string, value: number) => {
      context.updateJoint(robotId, jointName, value);
    },
    [context, robotId],
  );

  useEffect(() => {
    if (!isReady) return;
    if (!robotId) return;
    if (!onJointUpdate) return;

    const unsubscribe = context.subscribeToRobot(robotId, onJointUpdate);
    return unsubscribe;
  }, [isReady, robotId, context.subscribeToRobot, onJointUpdate]);

  if (!isReady) {
    return { ready: false } as const;
  }

  return { ready: true, updateJoint } as const;
};

export const useErrors = () => {
  const context = useContext(RobotContext);

  if (context === undefined) {
    throw new Error("useConnectionStatus must be used within a RobotProvider");
  }

  const show = useCallback(
    (err: string) => {
      context.setError(err);
      setTimeout(() => context.setError(""), 6000);
    },
    [context.setError],
  );

  return { show, message: context.error };
};

export const useConnectionStatus = () => {
  const context = useContext(RobotContext);

  if (context === undefined) {
    throw new Error("useConnectionStatus must be used within a RobotProvider");
  }

  return context.readyState;
};
