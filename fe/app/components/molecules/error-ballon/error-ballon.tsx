import { useErrors } from "~/lib/robot-client";
import "./error-balloon.css";

export const ErrorBallon = () => {
  const { message } = useErrors();
  const isVisible = message.length > 0;

  return <>{isVisible && <div className="error-balloon">{message}</div>}</>;
};
