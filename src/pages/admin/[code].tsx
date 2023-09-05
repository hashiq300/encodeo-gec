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
import Loader from "~/components/Loader"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"

const passwordSchema = z.object({
    password: z.string().min(3, {
        message: "password should be min 3 characters"
    })
})



function Summary() {
    const router = useRouter();
    const code = parseCode(router.query.code);
    const invalidCode = !codeSchema.safeParse({ code }).success;
    const [participants, setParticipants] = useState<Participants>([]);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: ""
        },
    })

    function onSubmit(data: z.infer<typeof passwordSchema>) {
        setPassword(data.password);
        setError("")
    }

    const participantsQuery = api.game.summary.useQuery({ code, password }, {
        enabled: !invalidCode && password !== "",
        refetchInterval: 5 * 1000,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            if (data.exists === "FALSE") {
                void router.push("/");
            } else if (data.exists === "TRUE") {
                setParticipants(data.data)
                setLoading(false)
            } else {
                setError("Wrong password");
            }
        },
        onError: () => {
            void router.push("/");
        }
    });

    if (error !== "") {
        return (
            <Layout>
                <main className="container mt-12 flex gap-8 justify-center items-center">
                    <h1 className="text-2xl font-medium text-red-600 dark:text-red-500 ">{error}</h1>
                    <Button className="bg-blue-600 hover:bg-blue-800 hover:dark:bg-blue-900 text-blue-50 dark:bg-blue-800" onClick={() => {
                        setError("")
                        setPassword("")
                    }}>Try Again</Button>
                </main>
            </Layout>
        )
    }

    if (password === "") {
        return (
            <Layout>
                <main className="container mt-5 max-w-[50rem]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10 mx-auto">
                            <h1 className="text-4xl font-bold text-center">Enter the Password</h1>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Enter password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={participantsQuery.isLoading && password !== ""} className='float-right' type="submit">Submit</Button>
                        </form>
                    </Form>
                </main>
            </Layout>
        )
    }

    if (loading || participantsQuery.isLoading) return <Loader />
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
