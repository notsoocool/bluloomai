"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GeneratePage() {
  const [reelTopic, setReelTopic] = useState("");
  const [reelNiche, setReelNiche] = useState("lifestyle");
  const [reelScript, setReelScript] = useState<Record<string, unknown> | null>(null);
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
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Generate</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered content creation. 20 generations per day.
        </p>
      </div>

      <div className="space-y-6">
        {/* Reel script */}
        <Card>
          <CardHeader>
            <CardTitle>Reel script</CardTitle>
            <CardDescription>
              Generate a full Reel script with hook, value bullets, and CTA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Topic</label>
                <input
                  type="text"
                  value={reelTopic}
                  onChange={(e) => setReelTopic(e.target.value)}
                  placeholder="e.g. morning routine"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Niche</label>
                <select
                  value={reelNiche}
                  onChange={(e) => setReelNiche(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="lifestyle">Lifestyle</option>
                  <option value="fitness">Fitness</option>
                  <option value="beauty">Beauty</option>
                  <option value="education">Education</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <Button onClick={handleReelGenerate} disabled={reelLoading}>
              {reelLoading ? "Generating..." : "Generate script"}
            </Button>
            {reelScript && (
              <div className="mt-4 rounded-lg border border-border p-4 text-sm space-y-2">
                {Object.entries(reelScript).map(([key, val]) => (
                  <div key={key}>
                    <span className="font-medium capitalize">{key}: </span>
                    {Array.isArray(val) ? (
                      <ul className="list-disc pl-4 mt-1">
                        {val.map((v, i) => (
                          <li key={i}>{String(v)}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>{String(val)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Caption */}
        <Card>
          <CardHeader>
            <CardTitle>Caption generator</CardTitle>
            <CardDescription>
              Create captions tailored to your niche and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Niche</label>
                <select
                  value={captionNiche}
                  onChange={(e) => setCaptionNiche(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="lifestyle">Lifestyle</option>
                  <option value="fitness">Fitness</option>
                  <option value="beauty">Beauty</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Tone</label>
                <select
                  value={captionTone}
                  onChange={(e) => setCaptionTone(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="casual">Casual</option>
                  <option value="professional">Professional</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Goal</label>
                <select
                  value={captionGoal}
                  onChange={(e) => setCaptionGoal(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="reach">Reach</option>
                  <option value="saves">Saves</option>
                  <option value="comments">Comments</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Context (optional)</label>
              <input
                type="text"
                value={captionContext}
                onChange={(e) => setCaptionContext(e.target.value)}
                placeholder="e.g. product launch, travel photo"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button onClick={handleCaptionGenerate} disabled={captionLoading}>
              {captionLoading ? "Generating..." : "Generate caption"}
            </Button>
            {caption && (
              <div className="mt-4 rounded-lg border border-border p-4 text-sm whitespace-pre-wrap">
                {caption}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hook optimizer */}
        <Card>
          <CardHeader>
            <CardTitle>Hook optimizer</CardTitle>
            <CardDescription>
              Improve weak hooks for better retention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current hook</label>
              <input
                type="text"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                placeholder="First 3 seconds of your Reel"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <Button onClick={handleHookOptimize} disabled={hookLoading || !hookText.trim()}>
              {hookLoading ? "Optimizing..." : "Optimize hook"}
            </Button>
            {optimizedHook && (
              <div className="mt-4 rounded-lg border border-border p-4 text-sm">
                {optimizedHook}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
