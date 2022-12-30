import { Masonry } from "masonic";
import { Button } from "./Button";
import { COLORS } from "./constants";

const cards = Array.from({ length: 40 }).map((_, index) => ({
  id: index,
  height: (
    400 + Math.round(Math.random() * 600)
  ),
}));

export function PromisesScreen() {
  const width = 400 * 3 + 40 * 2;
  return (
    <div
      css={{
        width,
        margin: "0 auto",
      }}
    >
      <div
        css={{
          display: "flex",
          gap: "16px",
          paddingBottom: "32px",
        }}
      >
        {["All", "Signed", "Nullified", "Discarded"].map((label, index) => (
          <Button
            key={label}
            color={COLORS.white}
            label={label}
            mode={index === 0 ? "primary" : "secondary"}
            css={{ color: index === 0 ? COLORS.pink : COLORS.white }}
          />
        ))}
      </div>
      <div>
        <Masonry
          columnWidth={400}
          columnGutter={40}
          items={cards}
          render={PromiseCard}
        />
      </div>
    </div>
  );
}

function PromiseCard({
  data,
  width,
}: {
  data: { height: number };
  width: number;
}) {
  return (
    <div
      css={{
        width,
        height: data.height,
        background: COLORS.white,
        borderRadius: "64px",
      }}
    />
  );
}
