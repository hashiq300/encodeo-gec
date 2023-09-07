import { useRouter } from "next/router"
import NextError from "next/error"
import { parseCode } from "~/utils/parser"
import { api } from "~/utils/api"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import type { Participation } from "~/types"
import Layout from "~/components/Layout"
import Loader from "~/components/Loader"
import { codeSchema } from "~/lib/schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import Head from "next/head"
import { Button } from "~/components/ui/button"
import Link from "next/link"


function Summary() {

    const router = useRouter();
    const user = useUser();
    const code = parseCode(router.query.code);
    const [loading, setLoading] = useState(true);
    const [participation, setParticipation] = useState<Participation>()

    const invalidCode = !codeSchema.safeParse({ code }).success;

    api.game.individualSummary.useQuery(code,
        {
            enabled: user.isLoaded && user.isSignedIn && !invalidCode,
            // refetchInterval: 20 * 1000,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setParticipation(data);
                setLoading(false);
            },
            onError: () => {
                void router.push("/");
            },
        })


    if (!user.isLoaded || code === "") return null;

    if (!user.isSignedIn) {
        void router.push("/");
        return null;
    }



    if (invalidCode) {
        return <NextError statusCode={404} />
    }

    if (loading) return <Loader />;

    return (
        <Layout>
            <Head>
                <title>Encodeo | {code}</title>
                <meta name="description" content="Encodeo GEC Palakkad, Invento pre-event" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex justify-center items-center">
                <Card className="mt-48 md:mt-36 px-1 md:px-4 py-2 max-w-[45rem] mx-4">
                    <CardHeader>
                        <CardTitle className="text-center text-sm font-extrabold md:text-2xl">
                            🎉 Congratulations on conquering ENCODEO! 🎉
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            <p className="text-center text-xs md:text-sm">You&apos;re a true champion. Thanks for playing! We invite you to continue your tech journey at INVENTO, our thrilling tech fest! Explore, innovate, and experience the future. Join us there for more tech excitement! 🚀👏</p>
                            {participation?.completedAt && <p className="text-center mt-5 text-xs md:text-sm">completed at: {participation.completedAt.toLocaleString()}</p>}

                        </CardDescription>
                        <div className="flex mt-6">
                            <Link href="/" className="border-primary border-2 rounded-sm mx-auto">
                                <Button variant="link">Go Home</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </Layout>
    )
}


export default Summary;