import { ReadyState } from "react-use-websocket";
import { useConnectionStatus } from "~/lib/robot-client";

import "./connection-status.css";

export const ConnectionStatus: React.FC = () => {
  const readyState = useConnectionStatus();

  const connected = readyState === ReadyState.OPEN;
  const color = connected
    ? "var(--color-connected)"
    : "var(--color-connecting)";

  return (
    <div className="connection-status">
      <div
        style={{ backgroundColor: color }}
        className="connection-status__indicator"
      />
      {connected ? "Connected" : "Connecting..."}
    </div>
  );
};
