import { Button } from "./Button";
import { COLORS } from "./constants";
import { IconArrowLeft } from "./IconArrowLeft";
import { IconArrowRight } from "./IconArrowRight";

export function Pagination({
  onNext,
  onPrev,
  page,
}: {
  onNext?: () => void;
  onPrev?: () => void;
  page: number;
}) {
  return (
    <div
      css={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
      }}
    >
      <Button
        color={COLORS.white}
        disabled={!onPrev}
        icon={<IconArrowLeft />}
        label="Back"
        onClick={onPrev}
      />
      <div
        css={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          fontWeight: 800,
          color: COLORS.pink,
          background: COLORS.white,
          borderRadius: "50%",
          userSelect: "none",
        }}
      >
        {page}
      </div>
      <Button
        color={COLORS.white}
        disabled={!onNext}
        icon={<IconArrowRight />}
        iconAfter={true}
        label="Next"
        onClick={onNext}
      />
    </div>
  );
}
