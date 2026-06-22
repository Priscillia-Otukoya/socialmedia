import "./index.css";
import { Composition } from "remotion";
import { CareerOS } from "./CareerOS";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CareerOS"
        component={CareerOS}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
