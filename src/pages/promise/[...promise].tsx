import type { GetServerSideProps } from "next";
import type { NetworkPrefix } from "../../types";

import Head from "next/head";
import { PromiseScreen } from "../../components/PromiseScreen";
import { parseFullPromiseId } from "../../lib/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const promiseQuery = Array.isArray(query.promise) ? query.promise : [];
  const [id = "", action = ""] = promiseQuery;

  const [networkPrefix, promiseId] = parseFullPromiseId(id ?? "") ?? [null, null];
  const fullPromiseId = `${networkPrefix}-${promiseId}`;

  return {
    props: {
      action,
      networkPrefix,
      promiseId,
      fullPromiseId,
    },
  };
};

export default function Promise({
  action,
  fullPromiseId,
  networkPrefix,
  promiseId,
}: {
  action: string;
  fullPromiseId: string;
  networkPrefix: NetworkPrefix;
  promiseId: number;
}) {
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
