import useWebSocketFix from "react-use-websocket";

// Library uses CommonJS, so we need to hack a little bit
export const useWebSocket: typeof useWebSocketFix = (useWebSocketFix as any)
  .default;
