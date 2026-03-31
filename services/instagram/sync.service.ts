/**
 * Instagram Sync Service
 * Orchestrates fetching posts, comments, and upserting to DB.
 * Idempotent, rate-limit safe.
 */

import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as postRepo from "@/repositories/post.repository";
import * as commentRepo from "@/repositories/comment.repository";
import * as instagramService from "./instagram.service";

export interface SyncResult {
  postsUpserted: number;
  commentsFetched: number;
  error?: string;
}

export async function syncAccount(instagramAccountId: string): Promise<SyncResult> {
  const account = await instagramAccountRepo.getById(instagramAccountId);
  if (!account) {
    throw new Error("Instagram account not found");
  }

  const accessToken = account.accessToken;
  if (new Date() >= account.tokenExpiresAt) {
    throw new Error("Access token expired. Please reconnect Instagram.");
  }

  const posts = await instagramService.fetchMedia(
    account.instagramBusinessAccountId,
    accessToken,
    50
  );

  const { inserted, updated } = await postRepo.upsertMany(account.id, posts);
  const postsUpserted = inserted + updated;

  let commentsFetched = 0;
  const existingPosts = await postRepo.getByAccountId(account.id, 50);

  for (const post of existingPosts.slice(0, 20)) {
    try {
      const comments = await instagramService.fetchComments(
        post.instagramPostId,
        accessToken
      );
      if (comments.length > 0) {
        await commentRepo.upsertMany(post.id, comments);
        commentsFetched += comments.length;
      }
      await sleep(300);
    } catch {
      break;
    }
  }

  return { postsUpserted, commentsFetched };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
