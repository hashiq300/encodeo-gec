import NextError from "next/error"
import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { useUser } from '@clerk/nextjs';
import QuestionUI from '~/components/Question';
import Layout from "~/components/Layout";
import type { CurrentQuestion, Quiz } from "~/types";
import Loader from "~/components/Loader";
import { codeSchema, type questionSchema } from "~/lib/schema";
import type * as z from "zod"
import Head from "next/head";





export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>();
    const [quiz, setQuiz] = useState<Quiz>();
    const [loading, setLoading] = useState(true);
    const [inputError, setInputError] = useState<string>()
    const router = useRouter();
    const user = useUser();

    const parsedCode = codeSchema.safeParse({ code: router.query.code });

    const invalidCode = !parsedCode.success;

    let code = ""
    if (parsedCode.success) {
        code = codeSchema.parse({ code: router.query.code }).code;
    }



    const quizApi = api.game.get.useQuery({
        code: code
    }, {
        enabled: user.isLoaded && user.isSignedIn && !invalidCode,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            if (data.isCompleted === "TRUE") {
                void router.push(`/summary/${code}`);
            } else {
                setCurrentQuestion(data.currentQuestion);
                setQuiz(data.quiz);
                setLoading(false)
            }
        },

    })

    const checkAnswer = api.game.check.useMutation({
        onSuccess: async (data) => {
            if (data.isCorrect) {
                if (data.isFinal) {
                    await router.push(`/summary/${code}`)
                } else if (data.nextQuestion && currentQuestion && quiz) {
                    setQuiz(prev => {
                        if (prev) {
                            return {
                                id: prev.id,
                                currentQuestion: data.nextQuestion.index,
                                status: prev.status
                            }
                        } else return undefined
                    })

                    setCurrentQuestion(data.nextQuestion)
                }
            } else {
                setInputError("The answer is wrong");
            }
        },

        onError: async (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                await router.push("/")
            } else {
                await router.push("/error")
            }
        },
    });

    if (!user.isLoaded) {
        return null;
    }

    if (!user.isSignedIn) {
        void router.push("/");
        return null;
    }

    if (invalidCode) {
        return <NextError statusCode={404} />
    }

    const pageLoading = quizApi.isLoading || loading;

    if (pageLoading) return <Loader />

    const handleFormSubmit = async (data: z.infer<typeof questionSchema>) => {
        await checkAnswer.mutateAsync({
            answer: data.answer,
            code
        })
    }

    return (
        <Layout>
            <Head>
                <title>Encodeo | {code}</title>
                <meta name="description" content="Encodeo GEC Palakkad, Invento pre-event" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container my-6 px-2 md:px-24 lg:px-32">
                    <QuestionUI
                    question={currentQuestion}
                    handleFormSubmit={handleFormSubmit}
                    loading={checkAnswer.isLoading}
                    error={inputError}
                />
            </main>
        </Layout>
    );
}



