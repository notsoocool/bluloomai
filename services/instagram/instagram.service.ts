/**
 * Instagram Integration Service
 * Uses official Meta Graph API only. No scraping.
 */

import { ExternalApiError, RateLimitError } from "@/lib/errors";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as postRepo from "@/repositories/post.repository";
import * as commentRepo from "@/repositories/comment.repository";
import type { PostRow } from "@/repositories/post.repository";
import type { CommentRow } from "@/repositories/comment.repository";

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";
const TOKEN_EXCHANGE_URL = "https://graph.facebook.com/v21.0/oauth/access_token";

export interface LongLivedTokenResult {
  accessToken: string;
  expiresIn: number; // seconds
}

export async function exchangeForLongLivedToken(
  shortLivedToken: string
): Promise<LongLivedTokenResult> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new ExternalApiError("Meta app credentials not configured", "meta");
  }

  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const res = await fetch(`${TOKEN_EXCHANGE_URL}?${params}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ExternalApiError(
      `Token exchange failed: ${body.error?.message ?? res.statusText}`,
      "meta",
      body
    );
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

export async function getInstagramBusinessAccount(
  pageAccessToken: string,
  userId: string
): Promise<{
  instagramBusinessAccountId: string;
  username: string;
  followersCount: number;
  profilePictureUrl?: string;
}> {
  const url = `${GRAPH_API_BASE}/${userId}/accounts?fields=instagram_business_account&access_token=${pageAccessToken}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ExternalApiError(
      `Failed to get Instagram account: ${body.error?.message ?? res.statusText}`,
      "meta",
      body
    );
  }

  const data = (await res.json()) as {
    data: Array<{ instagram_business_account?: { id: string } }>;
  };

  const page = data.data?.[0];
  const igAccountId = page?.instagram_business_account?.id;

  if (!igAccountId) {
    throw new ExternalApiError("No Instagram Business Account linked", "meta");
  }

  const profile = await fetchInstagramProfile(igAccountId, pageAccessToken);

  return {
    instagramBusinessAccountId: igAccountId,
    username: profile.username,
    followersCount: profile.followers_count,
    profilePictureUrl: profile.profile_picture_url,
  };
}

async function fetchInstagramProfile(
  igAccountId: string,
  accessToken: string
) {
  const url = `${GRAPH_API_BASE}/${igAccountId}?fields=username,followers_count,profile_picture_url&access_token=${accessToken}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ExternalApiError(
      `Failed to get profile: ${body.error?.message ?? res.statusText}`,
      "meta",
      body
    );
  }

  const data = (await res.json()) as {
    username: string;
    followers_count: number;
    profile_picture_url?: string;
  };

  return {
    username: data.username,
    followers_count: data.followers_count ?? 0,
    profile_picture_url: data.profile_picture_url,
  };
}

export async function fetchMedia(
  igAccountId: string,
  accessToken: string,
  limit = 50
): Promise<PostRow[]> {
  const posts: PostRow[] = [];
  let url: string | null = `${GRAPH_API_BASE}/${igAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${Math.min(limit, 25)}&access_token=${accessToken}`;

  while (url && posts.length < limit) {
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.error?.code === 4) {
        throw new RateLimitError("Instagram API rate limit reached");
      }
      throw new ExternalApiError(
        `Failed to fetch media: ${body.error?.message ?? res.statusText}`,
        "meta",
        body
      );
    }

    const data = (await res.json()) as {
      data: Array<{
        id: string;
        caption?: string;
        media_type: string;
        media_url?: string;
        permalink?: string;
        timestamp: string;
        like_count?: number;
        comments_count?: number;
      }>;
      paging?: { next?: string };
    };

    for (const item of data.data ?? []) {
      const mediaType =
        item.media_type === "VIDEO"
          ? "VIDEO"
          : item.media_type === "CAROUSEL_ALBUM"
            ? "CAROUSEL_ALBUM"
            : "IMAGE";

      posts.push({
        instagram_post_id: item.id,
        caption: item.caption ?? null,
        media_type: mediaType,
        media_url: item.media_url,
        permalink: item.permalink,
        timestamp: item.timestamp,
        like_count: item.like_count ?? 0,
        comment_count: item.comments_count ?? 0,
      });
    }

    url = data.paging?.next ?? null;

    if (url && posts.length < limit) {
      await sleep(500);
    }
  }

  return posts.slice(0, limit);
}

export async function fetchComments(
  postId: string,
  accessToken: string
): Promise<Omit<CommentRow, "post_id">[]> {
  const url = `${GRAPH_API_BASE}/${postId}/comments?fields=id,text,username,timestamp,like_count&access_token=${accessToken}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (body.error?.code === 4) {
      throw new RateLimitError("Instagram API rate limit reached");
    }
    return [];
  }

  const data = (await res.json()) as {
    data: Array<{
      id: string;
      text: string;
      username: string;
      timestamp: string;
      like_count?: number;
    }>;
  };

  return (data.data ?? []).map((c) => ({
    instagram_comment_id: c.id,
    text: c.text,
    username: c.username,
    timestamp: c.timestamp,
    like_count: c.like_count ?? 0,
  }));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
