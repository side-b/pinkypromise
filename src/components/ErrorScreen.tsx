import { useSpring } from "@react-spring/web";
import { Appear } from "../components/Appear";
import { Button } from "../components/Button";
import { LoadingFingers } from "../components/LoadingFingers";
import { COLORS } from "../constants";

export function ErrorScreen({ message = "Not found" }: { message?: string }) {
  const appear = useSpring({
    from: { opacity: 0, transform: "scale3d(0.8, 0.8, 1)" },
    to: { opacity: 1, transform: "scale3d(1, 1, 1)" },
    config: {
      mass: 2,
      friction: 80,
      tension: 1200,
    },
  });
  return (
    <Appear appear={appear}>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          color: COLORS.white,
        }}
      >
        <LoadingFingers
          color={COLORS.red}
          label={message}
        />
        <Button
          label="Back"
          color={COLORS.red}
          href="/"
          size="large"
        />
      </div>
    </Appear>
  );
}
