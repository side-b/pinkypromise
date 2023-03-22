import { useRouter } from "next/router";
import { PromisesScreen } from "../../components/PromisesScreen";

export default function Promises() {
  const router = useRouter();
  let page = parseInt(String(router.query.page?.[0]), 10);
  if (isNaN(page) || page < 1) page = 1;
  return (
    <PromisesScreen
      mineOnly={false}
      page={page}
    />
  );
}
