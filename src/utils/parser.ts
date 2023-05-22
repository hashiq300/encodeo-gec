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


export function dateTimeToString(dateTime: Date | null) {
    if (!dateTime) return "";
    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const day = ('0' + dateTime.getDate()).slice(-2);
    const hour = ('0' + dateTime.getHours()).slice(-2);
    const minute = ('0' + dateTime.getMinutes()).slice(-2);
    const second = ('0' + dateTime.getSeconds()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}
