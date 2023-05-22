import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, type createTRPCContext } from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
    check: publicProcedure.input(z.object({ code: z.string().length(6) }))
        .mutation(async ({ ctx, input }) => {


            const ans = await checkCode(ctx, input.code);
            return ans;
        }),
});


type Context = ReturnType<(typeof createTRPCContext)>;

export async function checkCode(ctx: Context, code: string) {
    try {
        Number(code)
    } catch (error) {
        throw new TRPCError({
            message: "Invalid code",
            code: "PARSE_ERROR"
        })
    }
    const quiz = await ctx.prisma.quiz.count({
        where: {
            code: code
        }
    })

    if (quiz === 0) return {
        exists: false,
        code: code
    }


    return {
        exists: true,
        code: code
    }

}