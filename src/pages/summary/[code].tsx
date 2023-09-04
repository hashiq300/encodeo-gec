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
            <main className="flex justify-center items-center">
                <Card className="mt-72 md:mt-52 px-4 py-2">
                    <CardHeader>
                        <CardTitle>
                            Quiz result of {code}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            {participation?.completedAt && <p className="text-center">completed at: {participation.completedAt.toLocaleString()}</p>}
                        </CardDescription>
                    </CardContent>
                </Card>
            </main>
        </Layout>
    )
}


export default Summary;