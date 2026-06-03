auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),

    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { ENV } = await import("./_core/env");
        if (input.password !== ENV.adminPassword) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Неверный пароль" });
        }
        const { getDb, upsertUser } = await import("./db");
        await upsertUser({
          openId: "admin",
          name: "Admin",
          email: null,
          loginMethod: "password",
          lastSignedIn: new Date(),
        });
        const db_ = await getDb();
        if (db_) {
          const { users } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          await db_.update(users).set({ role: "admin" }).where(eq(users.openId, "admin"));
        }
        const { SignJWT } = await import("jose");
        const secret = new TextEncoder().encode(ENV.cookieSecret);
        const token = await new SignJWT({ openId: "admin" })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("365d")
          .sign(secret);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 365 });
        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
