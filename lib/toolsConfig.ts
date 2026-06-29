import { OperationType } from "@/lib/EditorOrchestrator";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolConfig {
  slug: string;
  op: OperationType;
  /** Short label used in nav/cards, e.g. "Split Video" */
  label: string;
  /** <h1> and <title> — must be unique, not a template */
  title: string;
  /** Meta description — under 160 chars, unique per tool */
  metaDescription: string;
  /** One-sentence value prop shown under the H1 */
  tagline: string;
  /** 2-4 paragraphs of genuinely distinct body copy — no find/replace templating */
  intro: string[];
  /** Concrete use cases — specific, not generic "great for creators" filler */
  useCases: { title: string; description: string }[];
  faqs: ToolFaq[];
  /** Slugs of related tools to cross-link (internal linking signal) */
  related: string[];
  /** Pre-selects a value in the operation form, e.g. "mp3"/"gif" for
   *  format_convert. Only consumed when op === "format_convert". */
  defaultFormat?: string;
}

export const TOOLS_CONFIG: ToolConfig[] = [
  {
    slug: "split-video",
    op: "split",
    label: "Split Video",
    title: "Split Video Online — Cut Clips Into Multiple Parts",
    metaDescription:
      "Split any video into two or more parts directly in your browser. Pick exact cut points, preview each segment, and download — no upload, no signup, no watermark.",
    tagline: "Cut one video into multiple clips by setting exact timestamps — entirely in your browser.",
    intro: [
      "Splitting a video means dividing it into separate files at chosen points in time, rather than just trimming off the ends. This is the tool you want when you've recorded one long file — a lecture, a stream, a long interview — and need it broken into standalone pieces you can upload, share, or edit separately.",
      "Most online splitters force an upload to a remote server, which is slow for anything over a few hundred megabytes and raises an obvious question: where does your video go after that? This tool runs FFmpeg compiled to WebAssembly directly in your browser tab. The file is read from your device, processed on your device, and never transmitted anywhere.",
      "You can add as many cut points as you need in one pass — set two cuts and get three segments, set five and get six — rather than splitting once, re-uploading, and splitting again.",
    ],
    useCases: [
      { title: "Breaking up a long recording", description: "Turn a 90-minute webinar or podcast recording into individual chapter files without re-encoding the whole thing twice." },
      { title: "Extracting a highlight reel", description: "Pull out the three or four moments that matter from a long stream VOD as separate clips, ready to upload individually." },
      { title: "Preparing course content", description: "Cut one long lecture capture into per-topic segments for a learning platform that expects short, focused videos." },
    ],
    faqs: [
      {
        question: "Does splitting re-encode the video?",
        answer: "No — segments are cut using stream copy, which preserves the original quality exactly and finishes in seconds rather than minutes, since no frames are re-rendered.",
      },
      {
        question: "Is there a limit to how many parts I can split into?",
        answer: "Up to 9 cut points (10 segments) per operation in the interface. There's no hard file-size limit since everything runs locally — the practical ceiling is your device's available memory.",
      },
      {
        question: "Can I keep working on one of the segments after splitting?",
        answer: "Yes — after a split completes, you can select any resulting segment and immediately run another tool on it (compress, convert, trim) without re-uploading.",
      },
    ],
    related: ["trim-video", "compress-video", "video-to-gif"],
  },
  {
    slug: "compress-video",
    op: "compress",
    label: "Compress Video",
    title: "Compress Video Online — Reduce File Size Without Re-Uploading",
    metaDescription:
      "Shrink video file size in your browser using real FFmpeg compression (H.264 + CRF). Control the quality/size tradeoff directly. No upload, no file size limit, no watermark.",
    tagline: "Reduce video file size with adjustable quality — processed locally, nothing uploaded.",
    intro: [
      "Video compression trades file size for visual detail by re-encoding the footage with a different codec configuration — typically a lower bitrate or a higher CRF (constant rate factor) value. The right amount of compression depends entirely on what the file is for: a video headed to email has very different requirements than one going to a 4K display.",
      "Server-based compressors have to upload your full file before they can touch it, which is exactly backwards for the people who need compression most — anyone with a large file and a slow or metered connection. This tool compresses using the same FFmpeg engine professional tools use, running inside your browser via WebAssembly, so there's no upload step at all.",
      "The CRF slider here goes from 18 (visually near-lossless, larger output) to 45 (aggressively compressed, smaller output) — giving direct control instead of a single 'compress' button with a fixed, often disappointing result.",
    ],
    useCases: [
      { title: "Fitting under an upload limit", description: "Get a video under a platform's file size cap (email attachment limits, Discord's 25MB, a CMS upload ceiling) without leaving the browser." },
      { title: "Saving local storage", description: "Shrink a folder of phone-recorded videos that are eating into your device's free space, before archiving them." },
      { title: "Faster delivery to clients", description: "Send a smaller preview cut to a client for sign-off before exporting the full-quality final render." },
    ],
    faqs: [
      {
        question: "What does the CRF value actually control?",
        answer: "CRF sets a target quality level that the encoder tries to hit at the lowest possible bitrate. Lower numbers mean less compression and a closer-to-original look; higher numbers mean smaller files with more visible quality loss. 23–28 is a reasonable default for most footage.",
      },
      {
        question: "Will compression always make the file smaller?",
        answer: "In nearly all cases, yes, if the source wasn't already compressed at a similar or higher CRF. Re-compressing an already heavily compressed file at a lower CRF than its current state can occasionally increase size slightly — that's expected codec behavior, not a bug.",
      },
      {
        question: "Does compression affect audio?",
        answer: "The audio track is re-encoded to AAC at 128kbps by default alongside the video, which is generally not perceptible for spoken or non-critical audio.",
      },
    ],
    related: ["convert-video-to-mp3", "trim-video", "video-to-gif"],
  },

  {
    slug: "convert-video-to-mp3",
    op: "format_convert",
    label: "Convert Video to MP3",
    title: "Convert Video to MP3 Online — Extract Audio in Your Browser",
    metaDescription:
      "Extract the audio track from any video and save it as an MP3 directly in your browser. No upload, no software, no conversion queue — done in seconds.",
    tagline: "Pull the audio out of a video file and save it as MP3 — nothing leaves your device.",
    intro: [
      "Converting video to MP3 means discarding the picture entirely and keeping just the sound — useful any time the visual part of a file is irrelevant to what you actually need: a recorded interview, a lecture, a music video where you only want the track, or a voice memo someone sent as a video by mistake.",
      "Most 'video to mp3' sites online are upload-based converters that queue your file on a server, sometimes for several minutes, and many bury the actual download link behind ads or watermarks. This tool runs the conversion locally using FFmpeg compiled to WebAssembly — the moment you drop a file, the audio extraction happens in your browser tab, with no queue and no file ever leaving your device.",
      "The output is a standard MP3 at 192kbps, which is a solid middle ground between file size and audio fidelity for spoken word and most music.",
    ],
    useCases: [
      { title: "Saving a podcast-style recording", description: "Someone records a conversation on video by default (e.g. a phone camera) but you only need the audio — extract it as a clean MP3 without re-recording anything." },
      { title: "Pulling music from a video file", description: "Get just the audio track from a downloaded video so you can listen to it without the video player open." },
      { title: "Archiving voice notes sent as video", description: "Convert a video-format voice message into a small MP3 you can actually file away or forward without the bulky video container." },
    ],
    faqs: [
      {
        question: "What bitrate is the output MP3?",
        answer: "192kbps by default, which holds up well for spoken word, podcasts, and most music without producing an unnecessarily large file.",
      },
      {
        question: "Does this work on any video format?",
        answer: "Yes — MP4, MOV, WebM, AVI, MKV, and most other common containers are all supported as input, since the audio extraction step only cares about the audio stream inside the file.",
      },
      {
        question: "Is any video quality lost in the process?",
        answer: "There's no video output at all — the video stream is discarded entirely, not re-encoded, so there's nothing to lose quality on. Only the original audio stream is encoded into the MP3.",
      },
    ],
    related: ["compress-video", "convert-video-to-mp3", "trim-video"],
    defaultFormat: "mp3",
  },
  {
    slug: "video-to-gif",
    op: "format_convert",
    label: "Convert Video to GIF",
    title: "Video to GIF Converter — Create GIFs Online, No Upload",
    metaDescription:
      "Turn any video clip into a high-quality GIF in your browser. Control frame rate and size to balance quality against file size. No upload, no watermark.",
    tagline: "Turn a video clip into a shareable GIF — frame rate and size under your control.",
    intro: [
      "A GIF is a short, looping, soundless clip that plays automatically wherever it's embedded — in a chat app, a forum post, a README, a tweet — without needing a video player. Converting a video clip into one means re-encoding it into GIF's specific format: a limited color palette and no audio track, which is why naive conversions often come out looking banded or oddly colored.",
      "The biggest mistake most video-to-GIF tools make is ignoring resolution and frame rate entirely — a 1080p, 30fps source converted directly produces a GIF that's enormous (sometimes hundreds of megabytes) for a few seconds of footage, because GIF compression doesn't scale the way video codecs do. This tool exposes both controls directly: capping the frame rate (12fps is usually visually smooth enough) and the output width keeps file size sane without you needing to understand the underlying codec tradeoffs.",
      "Color quality is handled with a two-pass approach — generating a custom palette from your specific clip rather than using a generic one — which is the same technique recommended in FFmpeg's own documentation for producing GIFs that don't look washed out or banded.",
    ],
    useCases: [
      { title: "Reaction or meme clips", description: "Turn a short, funny moment from a longer video into a GIF you can drop directly into a chat or forum post." },
      { title: "Product or UI demos", description: "Convert a short screen recording into a GIF that auto-plays inline in documentation or a README, without requiring a video player." },
      { title: "Highlighting a moment from gameplay or sports footage", description: "Pull a few seconds of a clutch play or great moment out as a GIF, sized appropriately for sharing rather than a full video upload." },
    ],
    faqs: [
      {
        question: "Why is my GIF file size so much larger than the source clip?",
        answer: "GIF compression is much less efficient than modern video codecs, so even a few seconds can produce a large file at full resolution and frame rate. Lowering the width (try 480px or less) and frame rate (10-15fps) dramatically reduces size with minimal visible quality loss for most use cases.",
      },
      {
        question: "Why does my GIF have no audio?",
        answer: "The GIF format has no audio support at all — it's a fundamental limitation of the format, not something this tool strips out. If audio matters, an MP4 or WebM clip is the right format instead.",
      },
      {
        question: "What's a good frame rate for a smooth-looking GIF?",
        answer: "10-15fps looks smooth for most casual content and keeps file size reasonable. Going above 20fps rarely improves perceived smoothness enough to justify the size increase for typical GIF use cases like chat or social sharing.",
      },
    ],
    related: ["trim-video", "split-video", "compress-video"],
    defaultFormat: "gif",
  },
  {
    slug: "trim-video",
    op: "trim",
    label: "Trim Video",
    title: "Trim Video Online — Cut the Start and End Without Uploading",
    metaDescription:
      "Trim a video to an exact start and end time in your browser. Fast, lossless stream-copy trimming with no upload, no file size cap, and no watermark.",
    tagline: "Cut a video down to exactly the part you want — start and end times, nothing else.",
    intro: [
      "Trimming removes unwanted footage from the beginning and/or end of a clip, leaving a single continuous segment — distinct from splitting, which produces multiple output files from one input. It's the most common edit anyone makes: cutting dead air before a recording starts, or removing a few seconds after you've already said 'stop' but kept rolling.",
      "Because trimming only needs to specify two timestamps, it's one of the fastest operations FFmpeg can run — when done as a stream copy (no re-encoding), a multi-gigabyte file trims in roughly the time it takes to read and rewrite the relevant bytes, not the time it takes to decode and re-encode every frame.",
      "This tool runs that same stream-copy trim locally via FFmpeg WebAssembly, so there's no upload wait before the cut even starts.",
    ],
    useCases: [
      { title: "Removing dead air", description: "Cut the silent first few seconds of a screen recording before you started talking, and any trailing seconds after you stopped." },
      { title: "Isolating one moment from a long recording", description: "Pull out just the 30 seconds that matter from a much longer capture, without needing to split the whole file." },
      { title: "Cleaning up before sharing", description: "Trim a clip down to just the relevant portion before sending it to someone, rather than asking them to skip ahead themselves." },
    ],
    faqs: [
      {
        question: "Is trimming exact to the frame?",
        answer: "Trim points snap to the nearest keyframe when using fast stream-copy mode, which is usually within a fraction of a second of the requested timestamp. For frame-exact cuts you'd need a re-encode, which trades speed for precision.",
      },
      {
        question: "What's the difference between trim and split?",
        answer: "Trim keeps one continuous output — whatever's between your start and end point. Split produces multiple separate files by cutting at one or more points, keeping every resulting segment rather than discarding the parts outside a range.",
      },
      {
        question: "Can I preview before downloading?",
        answer: "Yes — the trimmed result plays directly in the browser via an inline preview the moment processing finishes, before you decide to download it or run another operation on it.",
      },
    ],
    related: ["split-video", "compress-video", "convert-video-to-mp3"],
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS_CONFIG.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return TOOLS_CONFIG.map((t) => t.slug);
}
