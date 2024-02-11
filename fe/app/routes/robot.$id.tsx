import { useCallback, useState } from "react";
import { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Panel } from "~/components/organisms/panel";
import { Scene, SceneLoader } from "~/components/organisms/scene";
import { RobotProvider } from "~/lib/robot-client";
import { DEFAULT_CRANE_STATE } from "~/lib/robot-schema";
import { ErrorBallon, ConnectionStatus } from "~/components/molecules";

type LoaderData = {
  WS_URL: string;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return { WS_URL: process.env.WS_URL as string };
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const params = useParams();
  const { WS_URL } = useLoaderData<LoaderData>();
  const [preview, setPreview] = useState(DEFAULT_CRANE_STATE);

  const updatePreview = useCallback((joint: string, value: number) => {
    setPreview((preview) => ({ ...preview, [joint]: value }));
  }, []);

  if (!params.id) {
    return <div>Missing robot ID</div>;
  }

  return (
    <RobotProvider wsUrl={WS_URL}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.8",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Scene state={preview} />
        <SceneLoader robotId={params.id} onUpdate={updatePreview} />

        <Panel robotId={params.id} state={preview} onPreview={updatePreview} />
        <ConnectionStatus />
        <ErrorBallon />
      </div>
    </RobotProvider>
  );
}
