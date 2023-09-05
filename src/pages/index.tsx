import { type NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/Layout";
import { useUser } from "@clerk/nextjs";
import HomeWithoutUser from "~/components/HomeWithoutUser";
import { Fragment } from "react";
import { InputForm } from "~/components/InputForm";
import Loader from "~/components/Loader";


const Home: NextPage = () => {
  const user = useUser()

  if (!user.isLoaded) return <Loader />;

  const fullName = (user.user?.firstName ?? "") + " " + (user.user?.lastName ?? "")

  return (
    <>
      <Head>
        <title>Encodeo | invento&apos;23</title>
        <meta name="description" content="Encodeo GEC Palakkad, Invento pre-event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main className="container max-w-[50rem]">
            {user.isSignedIn ? (
            <Fragment>
              <h1
                className="md:ml-12 my-12 text-xl font-medium"
              >Hi,&nbsp;
                <span>
                    {fullName.trim()} 👋
                </span>
              </h1>

              <h2
                className="text-center text-4xl font-bold"
                >
                  Enter the code
              </h2>
              <InputForm />
            </Fragment>
          ) : <HomeWithoutUser />}
        </main>
      </Layout>
    </>
  );
};

export default Home;
