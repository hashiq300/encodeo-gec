import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
    check: publicProcedure.input(z.object({ code: z.string().length(6) }))
        .mutation(async ({ ctx, input }) => {
            try {
                Number(input.code)
            } catch (error) {
                throw new TRPCError({
                    message: "Invalid code input",
                    code: "PARSE_ERROR"
                })
            }
            const quiz = await ctx.prisma.quiz.count({
                where: {
                    code: input.code
                }
            })

            if (quiz === 0) return {
                exists: false,
                code: input.code
            }


            return {
                exists: true,
                code: input.code
            }



        }),
});
