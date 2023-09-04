import type { RouterOutputs } from "./utils/api"

type Get = RouterOutputs["game"]["get"]

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>


export type CurrentQuestion = Get["currentQuestion"]

export type Quiz = Get["quiz"]

export type Participation = RouterOutputs["game"]["individualSummary"];
