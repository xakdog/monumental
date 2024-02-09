import type { MetaFunction } from "@remix-run/node";
import { Scene } from "~/components/organisms/scene";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Scene />
    </div>
  );
}
