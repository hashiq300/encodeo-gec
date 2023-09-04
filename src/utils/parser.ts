/* eslint-disable @typescript-eslint/restrict-plus-operands */
export function parseCode(code: string | string[] | undefined) {
    if (typeof code === "undefined") {
        return "".toString()
    }
    if (Array.isArray(code)) {
        return (code[0] ?? "").toString()
    }

    return code.toString()
}


type Question = {
    question: string;
    id: string;
    index: number;
    answers: string[];
}

export function parseQuestions(questions: Question[], current: number) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
    const { answers, ...currentQuestionContent } = questions[current]!;

    return {
        prevQuestions: questions.slice(0, current).map(question => ({
            ...question,
            answers: question.answers[0] ?? "NO_ANSWER"
        })),
        currentQuestionContent
    }
}


