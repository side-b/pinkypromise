import Head from "next/head";
import { useRouter } from "next/router";
import { ErrorScreen } from "../components/ErrorScreen";
import { PromiseScreen } from "../components/PromiseScreen";
import { parseFullPromiseId } from "../lib/utils";

type Action = "discard" | "sign" | "";
function isAction(action: string): action is Action {
  return action === "discard" || action === "sign" || action === "";
}

export default function Promise() {
  const router = useRouter();

  const promiseQuery = Array.isArray(router.query.promise)
    ? router.query.promise
    : [];

  const [id = "", action = ""] = promiseQuery;

  const [networkPrefix, promiseId] = parseFullPromiseId(id ?? "") ?? [null, null];
  const fullPromiseId = `${networkPrefix}-${promiseId}`;

  if (!networkPrefix || !promiseId || !isAction(action)) {
    return <ErrorScreen message="Promise not found" />;
  }

  return (
    <>
      <Head>
        <title>{`Pinky Promise ${fullPromiseId}`}</title>
        <meta
          property="og:image"
          content={`https://og.pinkypromise.gg/${fullPromiseId}`}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content={`${fullPromiseId}`} />
        <meta
          property="og:description"
          content="Onchain accountability from jolly commitments between friends and foes."
        />
      </Head>
      {Boolean(networkPrefix && promiseId) && (
        <PromiseScreen
          action={action}
          fullPromiseId={fullPromiseId}
          networkPrefix={networkPrefix}
          promiseId={promiseId}
        />
      )}
    </>
  );
}
