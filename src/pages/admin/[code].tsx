import Layout from "~/components/Layout"
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableHeader,
    TableCaption
} from "~/components/ui/table"
import { Progress } from "~/components/ui/progress"
import { api } from "~/utils/api"
import { useRouter } from "next/router"
import { parseCode } from "~/utils/parser"
import { codeSchema } from "~/lib/schema"
import { useState } from "react"
import type { Participants } from "~/types"
import { Loader } from "lucide-react"


function Summary() {
    const router = useRouter();
    const code = parseCode(router.query.code);
    const invalidCode = !codeSchema.safeParse({ code }).success;
    const [participants, setParticipants] = useState<Participants>([]);
    const [loading, setLoading] = useState(true);
    const participantsQuery = api.game.summary.useQuery({ code }, {
        enabled: !invalidCode,
        onSuccess: (data) => {
            if (data.exists === "FALSE") {
                void router.push("/");
            } else {
                setParticipants(data.data)
                setLoading(false)
            }
        },
        onError: () => {
            void router.push("/")
        }
    });

    if (loading || participantsQuery.isLoading) return (
        <Layout>
            <main className="flex justify-center">
                <Loader className="w-10 h-10 animate-spin mt-20" />
            </main>
        </Layout>
    )
    return (
        <Layout>
            <main className="container mt-5">
                {participants.length > 0 && (
                    <Table className="border-2">
                        <TableCaption>list of quiz players</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Completed At</TableHead>
                                <TableHead>Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participants.map((participant) => (
                                <TableRow key={participant.id}>
                                    <TableCell className="font-medium">{participant.user.fullName}</TableCell>
                                    <TableCell>{participant.user.email}</TableCell>
                                    <TableCell>{participant.status}</TableCell>
                                    <TableCell>{participant.completedAt?.toLocaleString() ?? "Nan"}</TableCell>
                                    <TableCell>

                                        <Progress value={participant.currentQuestion * 100 / participant.quiz.totalQuestions} />
                                        <p className="mt-2 text-center">{participant.currentQuestion} / {participant.quiz.totalQuestions}</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {participants.length === 0 && (
                    <h2 className="text-center text-2xl font-medium text-red-500">No participants Yet 😕</h2>
                )}
            </main>
        </Layout>
    )
}

export default Summary
