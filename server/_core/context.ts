import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { jwtVerify } from "jose";
import { parse as parseCookie } from "cookie";
import { ENV } from "./env";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookies = parseCookie(opts.req.headers.cookie ?? "");
    const token = cookies[COOKIE_NAME];
    if (token && ENV.cookieSecret) {
      const secret = new TextEncoder().encode(ENV.cookieSecret);
      const { payload } = await jwtVerify(token, secret);
      const openId = payload.openId as string | undefined;
      if (openId) {
        const db_ = await db.getDb();
        if (db_) {
          const { users } = await import("../../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const rows = await db_.select().from(users).where(eq(users.openId, openId)).limit(1);
          user = rows[0] ?? null;
        }
      }
    }
  } catch {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
