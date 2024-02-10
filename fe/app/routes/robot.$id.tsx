import { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { Scene } from "~/components/organisms/scene";
import { RobotProvider } from "~/lib/robot-client";

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
        <Scene robotId={params.id} />
      </div>
    </RobotProvider>
  );
}
