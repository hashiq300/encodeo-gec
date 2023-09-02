import { Button, Text, TextInput } from "@mantine/core";
import { IconLoaderQuarter } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown"
import type { Question, SetState } from "~/types";

type QuestionUIProps = {
    question: Question | undefined;
    handleFormSubmit: (evt: React.FormEvent<HTMLFormElement>, answer: string) => Promise<void>;
    loading: boolean;
    error: string | undefined;
    setError: SetState<string | undefined>;
    currentQuestionIndex: number;
    setCurrentIndex: SetState<number>
}

const QuestionUI = ({
    question,
    handleFormSubmit,
    error,
    setError,
    loading,
    currentQuestionIndex,
    setCurrentIndex
}: QuestionUIProps) => {

    const [answer, setAnswer] = useState(question?.answers ?? "");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }

        if (question) {
            setAnswer(question.answers)
        }
    }, [question?.id, question])



    if (!question || currentQuestionIndex === -1) return null;






    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form
            onSubmit={async (evt) => {
                await handleFormSubmit(evt, answer);
                setAnswer("")
            }}
            style={{
                marginTop: "2rem"
            }}
        >
            <Text fz="sm" >Q.no: <Text fz="xl" component="span">{question.index + 1}</Text></Text>
            <ReactMarkdown className="question_markdown">
                {question.question}
            </ReactMarkdown>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                <TextInput
                    ref={inputRef}
                    disabled={loading || question.answers.length > 0}
                    error={error}
                    value={answer}
                    onChange={(e) => {
                        setAnswer(e.target.value);
                        setError(undefined)
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    marginTop: '2rem',
                    marginBottom: "2rem"
                }}
            >

                {question.index !== 0 && <Button
                    type="button"
                    disabled={question.index === 0}
                    mr="auto"
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                >
                    Previous
                </Button>}

                {currentQuestionIndex !== question.index && (
                    <Button
                        type="button"
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        ml="auto"
                        miw="5.5rem"
                    >
                        Next
                    </Button>
                )}
                {currentQuestionIndex === question.index && (
                    <Button
                        ml="auto"
                        type="submit"
                        disabled={answer.trim().length === 0 || loading}
                        miw="5.5rem"
                    >
                        {loading ? (<IconLoaderQuarter
                            className="loader"
                            size="1.1rem"
                            stroke={1.5}
                        />) : "Submit"}
                    </Button>
                )}
            </div>
        </form>
    );
};

export default QuestionUI
