import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as contentService from "@/services/content-generation/content-generation.service";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await contentService.getTodayGenerationCount(userId);
  if (count >= 20) {
    return NextResponse.json(
      { error: "Daily generation limit reached" },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const topic = String(body.topic ?? "content creation");
  const niche = String(body.niche ?? "lifestyle");

  const account = await instagramAccountRepo.getByClerkUserId(userId);

  const script = await contentService.generateReelScript(
    userId,
    topic,
    niche,
    account?.id
  );

  if (!script) {
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(script);
}
