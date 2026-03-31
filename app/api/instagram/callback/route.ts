import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramService from "@/services/instagram/instagram.service";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as userRepo from "@/repositories/user.repository";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const code = request.nextUrl.searchParams.get("code");

  if (!userId || !code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=missing_params", request.url)
    );
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.redirect(
      new URL("/dashboard?error=config", request.url)
    );
  }

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`
    );

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: { message: string };
    };

    if (!tokenData.access_token) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${encodeURIComponent(tokenData.error?.message ?? "token_failed")}`, request.url)
      );
    }

    const longLived = await instagramService.exchangeForLongLivedToken(
      tokenData.access_token
    );

    const userRes = await fetch(
      `https://graph.facebook.com/v21.0/me?access_token=${tokenData.access_token}`
    );
    const userData = (await userRes.json()) as { id?: string };
    const fbUserId = userData.id;

    if (!fbUserId) {
      return NextResponse.redirect(new URL("/dashboard?error=no_user", request.url));
    }

    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/${fbUserId}/accounts?access_token=${longLived.accessToken}`
    );
    const pagesData = (await pagesRes.json()) as {
      data?: Array<{ access_token: string; id: string }>;
    };

    const page = pagesData.data?.[0];
    if (!page) {
      return NextResponse.redirect(new URL("/dashboard?error=no_page", request.url));
    }

    const pageTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?fields=access_token&access_token=${longLived.accessToken}`
    );
    const pageTokenData = (await pageTokenRes.json()) as { access_token?: string };
    const pageAccessToken = pageTokenData.access_token ?? page.access_token;

    const igProfile = await instagramService.getInstagramBusinessAccount(
      pageAccessToken,
      page.id
    );

    const dbUserId = await userRepo.getOrCreateByClerkId(userId);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + longLived.expiresIn);

    await instagramAccountRepo.upsert({
      userId: dbUserId,
      instagramBusinessAccountId: igProfile.instagramBusinessAccountId,
      username: igProfile.username,
      followersCount: igProfile.followersCount,
      profilePictureUrl: igProfile.profilePictureUrl,
      accessTokenEncrypted: pageAccessToken,
      tokenExpiresAt: expiresAt.toISOString(),
    });

    return NextResponse.redirect(new URL("/dashboard?connected=1", request.url));
  } catch (err) {
    console.error("Instagram callback error:", err);
    return NextResponse.redirect(
      new URL("/dashboard?error=callback_failed", request.url)
    );
  }
}
