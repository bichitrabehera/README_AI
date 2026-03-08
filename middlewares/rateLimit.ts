import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

export async function checkRateLimit(): Promise<NextResponse | string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.name;
  const lastGenerated = rateLimitMap.get(userId);

  if (lastGenerated && Date.now() - lastGenerated < RATE_LIMIT_WINDOW) {
    const resetAt = new Date(lastGenerated + RATE_LIMIT_WINDOW);
    return NextResponse.json(
      {
        error:
          "You can only generate one README per day. Try again after " +
          resetAt.toLocaleString(),
      },
      { status: 429 },
    );
  }

  return userId;
}

export function recordUsage(username: string) {
  rateLimitMap.set(username, Date.now());
}
