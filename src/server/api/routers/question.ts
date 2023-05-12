// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  get: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.quiz.findMany();

    }),
});
