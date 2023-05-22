import { useRouter } from "next/router"
import NextError from "next/error"
import { dateTimeToString, parseCode } from "~/utils/parser"
import { api } from "~/utils/api"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import type { Participation } from "~/types"
import Layout from "~/components/Layout"
import Loader from "~/components/Loader"
import { Image } from "@mantine/core"



function Summary() {

    const router = useRouter()
    const user = useUser()
    const code = parseCode(router.query.code)
    const [participations, setParticipations] = useState<Participation[]>([]);
    const [loading, setLoading] = useState(true);

    const invalidCode = (code.length !== 6 || !/^\d+$/.test(code)) && code.length !== 0;

    api.game.summary.useQuery({
        code: code
    },
        {
            enabled: user.isLoaded && user.isSignedIn && code.length === 6,
            onSuccess: async (data) => {
                if (data.exists === "FALSE") {
                    await router.push("/")
                } else {
                    setParticipations(data.data)
                    setLoading(false)
                }
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
            <h1>{code}</h1>
            <h3>Winners :-</h3>
            <ul>
                {participations.map((participation) => (
                    <li key={participation.id}>

                        <Image
                            height={38}
                            radius="xl"
                            placeholder={<Image src="/usericon.png" alt="" />} withPlaceholder
                            width={38}
                            src={participation.user.profileImageUrl}
                            alt={`profile pic of ${participation.user.fullName}`}
                        />
                        <h2>{participation.user.fullName}</h2>
                        <p>completed at: {dateTimeToString(participation.completedAt)}</p>
                    </li>
                )
                )}
            </ul>
        </Layout>
    )
}


export default Summary