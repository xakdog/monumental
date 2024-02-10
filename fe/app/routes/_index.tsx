import { redirect, type LoaderFunction } from "@remix-run/node";
import { createRobot } from "~/lib/create-robot";
import { CRANE_JOINTS } from "~/lib/robot-schema";

export const loader: LoaderFunction = async () => {
  const robotId = await createRobot(CRANE_JOINTS);

  return redirect(`/robot/${robotId}`);
};
