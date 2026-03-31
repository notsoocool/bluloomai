import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as viralPatternService from "@/services/viral-pattern/viral-pattern.service";

export async function GET() {
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

  const insights = await viralPatternService.getViralPatternInsights(account.id);
  return NextResponse.json(insights ?? { error: "Insufficient data" });
}
