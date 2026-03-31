import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as syncService from "@/services/instagram/sync.service";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  if (!account) {
    return NextResponse.json(
      { error: "No Instagram account connected" },
      { status: 400 }
    );
  }

  try {
    const result = await syncService.syncAccount(account.id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
