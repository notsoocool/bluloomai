import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await instagramAccountRepo.getByClerkUserId(userId);

  return NextResponse.json({
    connected: !!account,
    account: account
      ? {
          username: account.username,
          followersCount: account.followersCount,
          profilePictureUrl: account.profilePictureUrl,
          tokenExpiresAt: account.tokenExpiresAt,
        }
      : null,
  });
}
