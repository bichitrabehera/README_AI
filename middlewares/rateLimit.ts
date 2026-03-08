import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Redis } from "@upstash/redis";

const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function checkRateLimit(): Promise<NextResponse | string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.name;
  const key = `rate_limit:${userId}`;

  const lastGenerated = await redis.get<string>(key);

  if (lastGenerated) {
    const elapsed = Date.now() - parseInt(lastGenerated);
    if (elapsed < RATE_LIMIT_WINDOW) {
      const resetAt = new Date(parseInt(lastGenerated) + RATE_LIMIT_WINDOW);
      return NextResponse.json(
        {
          error:
            "You can only generate one README per day. Try again after " +
            resetAt.toLocaleString(),
        },
        { status: 429 },
      );
    }
  }

  return userId;
}

export async function recordUsage(username: string) {
  const key = `rate_limit:${username}`;
  await redis.set(key, Date.now().toString(), { px: RATE_LIMIT_WINDOW });
}
