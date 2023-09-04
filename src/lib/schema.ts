import * as z from "zod";

export const questionSchema = z.object({
    answer: z.string().min(1, {
        message: "answer is required"
    })
})

export const codeSchema = z.object({
    code: z.string().length(6, {
        message: "code must be 6 digit number"
    }).regex(/^[0-9]+$/, {
        message: "code must be 6 digit number"
    }),
})
