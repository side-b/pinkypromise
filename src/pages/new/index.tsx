import Head from "next/head";
import { NewPromiseScreen } from "../../components/NewPromiseScreen";

export default function New() {
  return (
    <>
      <Head>
        <title>Create a New Promise</title>
      </Head>
      <NewPromiseScreen />
    </>
  );
}
