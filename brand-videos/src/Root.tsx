import "./index.css";
import { Composition } from "remotion";
import { HeroAmbient } from "./HeroAmbient";

// 6 秒 seamless loop @ 30fps，1920×1080
// 所有動畫週期 = durationInFrames，frame 0 ≡ frame 180 視覺完全相同
const FPS = 30;
const DURATION_SECONDS = 6;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroAmbient"
        component={HeroAmbient}
        durationInFrames={FPS * DURATION_SECONDS}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
