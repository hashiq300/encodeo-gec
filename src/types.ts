import type { RouterOutputs } from "./utils/api"

type Details = NonNullable<RouterOutputs["game"]["get"]["details"]>

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Question = Details["prevQuestions"][number]

export type CurrentQuestion = Details["currentQuestionContent"]

export type Quiz = Details["quiz"]

export type Participation = (NonNullable<RouterOutputs["game"]["summary"]["data"]>)[number]
