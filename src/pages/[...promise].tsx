import type { NextPage } from "next";
import type { NetworkPrefix } from "../types";

import Head from "next/head";
import { ErrorScreen } from "../components/ErrorScreen";
import { PromiseScreen } from "../components/PromiseScreen";
import { parseFullPromiseId } from "../lib/utils";

interface PromisePageProps {
  action: "" | "discard" | "sign";
  fullPromiseId: string;
  networkPrefix: NetworkPrefix;
  notFound: boolean;
  promiseId: number;
}

const PromisePage: NextPage<PromisePageProps> = ({
  action,
  fullPromiseId,
  networkPrefix,
  notFound,
  promiseId,
}) => {
  if (notFound) {
    return <ErrorScreen />;
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
};

PromisePage.getInitialProps = ({ query }): PromisePageProps => {
  const promiseQuery = Array.isArray(query.promise) ? query.promise : [];
  const [id = "", action = ""] = promiseQuery;

  const [networkPrefix, promiseId] = parseFullPromiseId(id ?? "") ?? [null, null];
  const fullPromiseId = `${networkPrefix}-${promiseId}`;

  if (!networkPrefix || !promiseId || !isActionValid(action)) {
    return {
      action: "" as const,
      networkPrefix: "E" as const,
      promiseId: -1,
      fullPromiseId: "",
      notFound: true,
    };
  }

  return {
    action,
    networkPrefix,
    promiseId,
    fullPromiseId,
    notFound: false,
  };
};

function isActionValid(action: string): action is PromisePageProps["action"] {
  return action === "" || action === "discard" || action === "sign";
}

export default PromisePage;
