
import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { parseQuestions } from "~/utils/parser";
import { checkCode } from "./quiz";



export const gameRouter = createTRPCRouter({
    get: protectedProcedure.input(z.object({ code: z.string().length(6) }))
        .query(async ({ ctx, input }) => {
            let quizParticipation = await ctx.prisma.quizParticipation.findUnique({
                where: {
                    quizCode_userId: {
                        quizCode: input.code,
                        userId: ctx.auth.userId
                    }
                },
                select: {
                    currentQuestion: true,
                    id: true,
                    status: true
                }
            })



            if (quizParticipation === null) {
                const quiz = await ctx.prisma.quiz.findUnique({
                    where: {
                        code: input.code
                    }
                })
                if (!quiz) {
                    throw new TRPCError({
                        message: "Invalid quiz code",
                        code: "BAD_REQUEST"
                    })
                }

                quizParticipation = await ctx.prisma.quizParticipation.create({
                    data: {
                        userId: ctx.auth.userId,
                        quizCode: quiz.code,
                        // endingAt: new Date(new Date().getTime() + quiz.duration * 1000)
                    },
                    select: {
                        currentQuestion: true,
                        id: true,
                        status: true
                    }
                })
                if (quizParticipation === null) {
                    throw new TRPCError({
                        message: "Internal error at creating participation",
                        code: "INTERNAL_SERVER_ERROR"
                    })
                }
            }

            let isCompleted: "TRUE" | "FALSE" = "FALSE";

            if (quizParticipation.status === "COMPLETED") {
                isCompleted = "TRUE"
                return {
                    isCompleted,
                    details: null
                }
            }


            const questions = await ctx.prisma.question.findMany({
                where: {
                    index: {
                        lte: quizParticipation.currentQuestion
                    }
                },
                select: {
                    answers: true,
                    id: true,
                    question: true,
                    index: true,
                },
                orderBy: {
                    index: "asc"
                }
            })

            const splittedQuestions = parseQuestions(questions, quizParticipation.currentQuestion);



            return {
                isCompleted,
                details: {
                    quiz: quizParticipation,
                    ...splittedQuestions
                }
            }
        }),
    check: protectedProcedure.input(z.object({ answer: z.string().min(1), code: z.string().length(6) }))
        .mutation(async ({ ctx, input }) => {
            const quizParticipation = await ctx.prisma.quizParticipation.findUnique({
                where: {
                    quizCode_userId: {
                        quizCode: input.code,
                        userId: ctx.auth.userId
                    }
                },
                include: {
                    quiz: {
                        select: {
                            totalQuestions: true
                        }
                    }
                }
            })

            if (!quizParticipation) {
                throw new TRPCError({
                    message: "do not have a participation",
                    code: "BAD_REQUEST"
                })
            }

            if (quizParticipation.status === "COMPLETED") {
                throw new TRPCError({
                    message: "the quiz has been already completed",
                    code: "UNAUTHORIZED"
                })
            }

            const question = await ctx.prisma.question.findFirst({
                where: {
                    index: quizParticipation.currentQuestion,
                    quizCode: quizParticipation.quizCode
                }
            })

            if (!question) {
                throw new TRPCError({
                    message: "ques not found",
                    code: "INTERNAL_SERVER_ERROR"
                })
            }

            let isCorrect = false;

            question.answers.forEach(answer => {
                if (answer.toLowerCase() === input.answer.toLowerCase())
                    isCorrect = true;
            })

            if (isCorrect) {
                if (quizParticipation.currentQuestion >= quizParticipation.quiz.totalQuestions - 1) {
                    await ctx.prisma.quizParticipation.update({
                        where: {
                            quizCode_userId: {
                                quizCode: input.code,
                                userId: ctx.auth.userId
                            }
                        },
                        data: {
                            status: "COMPLETED",
                            completedAt: new Date()
                        }
                    })
                    return {
                        isCorrect: true,
                        isFinal: true,
                        nextQuestion: null
                    }
                }
                const updatedQuizparticipation = await ctx.prisma.quizParticipation.update({
                    where: {
                        quizCode_userId: {
                            quizCode: input.code,
                            userId: ctx.auth.userId
                        }
                    },
                    data: {
                        currentQuestion: {
                            increment: 1
                        }
                    }
                })

                if (!updatedQuizparticipation) {
                    throw new TRPCError({
                        message: "updation failed",
                        code: "INTERNAL_SERVER_ERROR"
                    })
                }

                const nextQuestion = await ctx.prisma.question.findFirst({
                    where: {
                        index: updatedQuizparticipation.currentQuestion,
                        quizCode: input.code
                    },
                    select: {
                        id: true,
                        question: true,
                        index: true,
                    }
                })

                if (!nextQuestion) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR"
                    })
                }
                return {
                    isCorrect: true,
                    isFinal: false,
                    nextQuestion,
                }
            } else {
                return {
                    isCorrect: false,
                    isFinal: false,
                    nextQuestion: null
                }
            }


        }),
    summary: protectedProcedure.input(z.object({ code: z.string().length(6) })).query(async ({ ctx, input }) => {
        const ans = await checkCode(ctx, input.code)
        let exists: "TRUE" | "FALSE" = "TRUE"
        if (!ans.exists) {
            exists = "FALSE"
            return {
                exists,
                data: null
            }
        }
        const participations = await ctx.prisma.quizParticipation.findMany({
            where: {
                quizCode: input.code,
                status: "COMPLETED"
            },
            select: {
                id: true,
                completedAt: true,
                userId: true,
            },
            orderBy: {
                completedAt: "asc"
            }

        })

        const userIds = participations.map(participation => participation.userId)


        const users = await clerkClient.users.getUserList({ userId: userIds });

        const participationWithUser = participations.map(participation => ({
            ...participation,
            user: parseUser(users.find(user => user.id === participation.userId))
        }))

        return {
            exists,
            data: participationWithUser
        }
    })

});


function parseUser(user: User | undefined) {
    if (!user) {
        return {
            userId: crypto.randomUUID(),
            fullName: "ANON",
            profileImageUrl: "/anon.png",
        }
    }
    let fullName = (user?.firstName ?? "") + " " + (user?.lastName ?? "");
    if (fullName.trim().length === 0) {
        fullName = "NO NAME"
    }
    return {
        userId: user.id,
        fullName,
        profileImageUrl: user.profileImageUrl
    }

}


