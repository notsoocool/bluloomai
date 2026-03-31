import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as analysisService from "@/services/ai/analysis.service";

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

  const body = await request.json().catch(() => ({}));
  const limit = Math.min(Number(body.limit) || 10, 20);

  const result = await analysisService.analyzeAccountPosts(account.id, limit);
  return NextResponse.json(result);
}
