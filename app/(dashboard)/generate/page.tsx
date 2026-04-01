"use client";

import { useState } from "react";
import {
  landingFormControl,
  landingFormLabel,
  landingOutputBox,
  landingPanel,
  landingPrimaryButton,
} from "@/components/landing/landing-theme";
import { cn } from "@/lib/utils";

export default function GeneratePage() {
  const [reelTopic, setReelTopic] = useState("");
  const [reelNiche, setReelNiche] = useState("lifestyle");
  const [reelScript, setReelScript] = useState<Record<string, unknown> | null>(
    null
  );
  const [reelLoading, setReelLoading] = useState(false);

  const [captionNiche, setCaptionNiche] = useState("lifestyle");
  const [captionTone, setCaptionTone] = useState("casual");
  const [captionGoal, setCaptionGoal] = useState("reach");
  const [captionContext, setCaptionContext] = useState("");
  const [caption, setCaption] = useState<string | null>(null);
  const [captionLoading, setCaptionLoading] = useState(false);

  const [hookText, setHookText] = useState("");
  const [optimizedHook, setOptimizedHook] = useState<string | null>(null);
  const [hookLoading, setHookLoading] = useState(false);

  const handleReelGenerate = async () => {
    setReelLoading(true);
    setReelScript(null);
    try {
      const res = await fetch("/api/generate/reel-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: reelTopic || "content creation",
          niche: reelNiche,
        }),
      });
      const data = await res.json();
      if (res.ok) setReelScript(data);
      else console.error(data.error);
    } finally {
      setReelLoading(false);
    }
  };

  const handleCaptionGenerate = async () => {
    setCaptionLoading(true);
    setCaption(null);
    try {
      const res = await fetch("/api/generate/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: captionNiche,
          tone: captionTone,
          goal: captionGoal,
          context: captionContext || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) setCaption(data.caption);
      else console.error(data.error);
    } finally {
      setCaptionLoading(false);
    }
  };

  const handleHookOptimize = async () => {
    if (!hookText.trim()) return;
    setHookLoading(true);
    setOptimizedHook(null);
    try {
      const res = await fetch("/api/generate/hook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: hookText }),
      });
      const data = await res.json();
      if (res.ok) setOptimizedHook(data.hook);
      else console.error(data.error);
    } finally {
      setHookLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          BLULOOMAI · AI TOOLS
        </p>
        <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
          Generate
        </h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-500">
          AI-powered content creation. 20 generations per day.
        </p>
      </div>

      <div className="space-y-6">
        <article className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            REEL SCRIPT
          </p>
          <h2 className="mt-4 text-xl font-semibold md:text-2xl">Reel script</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Generate a full Reel script with hook, value bullets, and CTA
          </p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={landingFormLabel}>Topic</label>
                <input
                  type="text"
                  value={reelTopic}
                  onChange={(e) => setReelTopic(e.target.value)}
                  placeholder="e.g. morning routine"
                  className={landingFormControl}
                />
              </div>
              <div>
                <label className={landingFormLabel}>Niche</label>
                <select
                  value={reelNiche}
                  onChange={(e) => setReelNiche(e.target.value)}
                  className={landingFormControl}
                >
                  <option value="lifestyle">Lifestyle</option>
                  <option value="fitness">Fitness</option>
                  <option value="beauty">Beauty</option>
                  <option value="education">Education</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReelGenerate}
              disabled={reelLoading}
              className={landingPrimaryButton}
            >
              {reelLoading ? "Generating..." : "Generate script"}
            </button>
            {reelScript && (
              <div className={cn(landingOutputBox, "space-y-2")}>
                {Object.entries(reelScript).map(([key, val]) => (
                  <div key={key}>
                    <span className="font-medium capitalize text-zinc-300">
                      {key}:{" "}
                    </span>
                    {Array.isArray(val) ? (
                      <ul className="mt-1 list-disc pl-4 text-zinc-400">
                        {val.map((v, i) => (
                          <li key={i}>{String(v)}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-zinc-400">{String(val)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        <article className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            CAPTION
          </p>
          <h2 className="mt-4 text-xl font-semibold md:text-2xl">
            Caption generator
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create captions tailored to your niche and goals
          </p>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={landingFormLabel}>Niche</label>
                <select
                  value={captionNiche}
                  onChange={(e) => setCaptionNiche(e.target.value)}
                  className={landingFormControl}
                >
                  <option value="lifestyle">Lifestyle</option>
                  <option value="fitness">Fitness</option>
                  <option value="beauty">Beauty</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div>
                <label className={landingFormLabel}>Tone</label>
                <select
                  value={captionTone}
                  onChange={(e) => setCaptionTone(e.target.value)}
                  className={landingFormControl}
                >
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
              <div>
                <label className={landingFormLabel}>Goal</label>
                <select
                  value={captionGoal}
                  onChange={(e) => setCaptionGoal(e.target.value)}
                  className={landingFormControl}
                >
                  <option value="reach">Reach</option>
                  <option value="saves">Saves</option>
                  <option value="comments">Comments</option>
                </select>
              </div>
            </div>
            <div>
              <label className={landingFormLabel}>Context (optional)</label>
              <input
                type="text"
                value={captionContext}
                onChange={(e) => setCaptionContext(e.target.value)}
                placeholder="e.g. product launch, travel photo"
                className={landingFormControl}
              />
            </div>
            <button
              type="button"
              onClick={handleCaptionGenerate}
              disabled={captionLoading}
              className={landingPrimaryButton}
            >
              {captionLoading ? "Generating..." : "Generate caption"}
            </button>
            {caption && (
              <div className={cn(landingOutputBox, "whitespace-pre-wrap")}>
                {caption}
              </div>
            )}
          </div>
        </article>

        <article className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}>
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">HOOK</p>
          <h2 className="mt-4 text-xl font-semibold md:text-2xl">
            Hook optimizer
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Improve weak hooks for better retention
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className={landingFormLabel}>Current hook</label>
              <input
                type="text"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                placeholder="First 3 seconds of your Reel"
                className={landingFormControl}
              />
            </div>
            <button
              type="button"
              onClick={handleHookOptimize}
              disabled={hookLoading || !hookText.trim()}
              className={landingPrimaryButton}
            >
              {hookLoading ? "Optimizing..." : "Optimize hook"}
            </button>
            {optimizedHook && (
              <div className={landingOutputBox}>{optimizedHook}</div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
