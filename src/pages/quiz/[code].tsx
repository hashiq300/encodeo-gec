import NextError from "next/error"
import { useEffect, useState } from 'react';
import { Container } from '@mantine/core';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { useUser } from '@clerk/nextjs';
import QuestionUI from '~/components/Question';
import Layout from "~/components/Layout";
import type { CurrentQuestion, Question, Quiz } from "~/types";
import { parseCode } from "~/utils/parser";
import Loader from "~/components/Loader";





export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>();
    const [displayQuestion, setDisplayQuestion] = useState<Question>();
    const [quiz, setQuiz] = useState<Quiz>();
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [prevQuestions, setPrevQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputError, setInputError] = useState<string>()
    const router = useRouter();
    const user = useUser();
    const code = parseCode(router.query.code)

    const invalidCode = (code.length !== 6 || !/^\d+$/.test(code)) && code.length !== 0;
    useEffect(() => {
        if (currentIndex === -1) return;
        if (currentIndex === quiz?.currentQuestion && currentQuestion) {
            setDisplayQuestion({
                ...currentQuestion,
                answers: ""
            })
        } else {
            setDisplayQuestion(prevQuestions[currentIndex])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex])





    const quizApi = api.game.get.useQuery({
        code: code
    }, {
        enabled: user.isLoaded && user.isSignedIn && !invalidCode,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            if (data.isCompleted === "TRUE") {
                void router.push(`/summary/${code}`);
            } else {
                const { details } = data
                setPrevQuestions(details.prevQuestions);
                setCurrentIndex(details.quiz.currentQuestion);
                setCurrentQuestion(details.currentQuestionContent);
                setQuiz(details.quiz);
                setLoading(false)
            }
        },

    })

    const checkAnswer = api.game.check.useMutation({
        onSuccess: async (data, variables) => {
            if (data.isCorrect) {
                if (data.isFinal) {
                    console.log("final answer");
                    await router.push(`/summary/${code}`)
                } else if (data.nextQuestion && currentQuestion && quiz) {
                    setQuiz({
                        id: quiz.id,
                        currentQuestion: currentQuestion.index + 1,
                        status: quiz.status
                    })
                    setPrevQuestions(prev => ([...prev, {
                        ...currentQuestion,
                        answers: variables.answer,
                    }]))
                    setCurrentIndex(data.nextQuestion.index)
                    setCurrentQuestion(data.nextQuestion)
                }
            } else {
                setInputError("The answer is wrong");
            }
        },

        onError: async (error) => {
            if (error.data?.code === "UNAUTHORIZED") {
                await router.push("/")
            }
        },
    });

    if (!user.isLoaded) return null;

    if (!user.isSignedIn) {
        void router.push("/");
        return null;
    }

    if (invalidCode) {
        return <NextError statusCode={404} />
    }

    const pageLoading = quizApi.isLoading || loading;

    if (pageLoading) return <Loader />

    const handleFormSubmit = async (evt: React.FormEvent<HTMLFormElement>, answer: string) => {
        evt.preventDefault();
        await checkAnswer.mutateAsync({
            answer,
            code
        })
    }

    return (
        <Layout>
            <main>
                <Container size="md">
                    <QuestionUI
                        question={displayQuestion}
                        handleFormSubmit={handleFormSubmit}
                        loading={checkAnswer.isLoading}
                        error={inputError}
                        setError={setInputError}
                        currentQuestionIndex={quiz?.currentQuestion ?? -1}

                        setCurrentIndex={setCurrentIndex}
                    />
                </Container>
            </main>
        </Layout>
    );
}



