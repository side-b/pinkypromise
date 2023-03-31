import Head from "next/head";
import { NewPromiseScreen } from "../../components/NewPromiseScreen";
import { NoSsr } from "../../components/NoSsr";

export default function New() {
  return (
    <>
      <Head>
        <title>Create a New Promise</title>
      </Head>
      <NoSsr>
        <NewPromiseScreen />
      </NoSsr>
    </>
  );
}
