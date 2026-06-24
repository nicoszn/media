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
    related: ["trim-video", "merge-video", "compress-video"],
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
    related: ["convert-video", "resize-video", "trim-video"],
  },
  {
    slug: "convert-video",
    op: "format_convert",
    label: "Convert Video",
    title: "Convert Video Format Online — MP4, WebM, MOV, MKV, and More",
    metaDescription:
      "Convert video and audio between formats (MP4, WebM, MOV, AVI, MKV, MP3, WAV) directly in your browser. No upload, no software install, no conversion limits.",
    tagline: "Convert between video and audio formats locally — your file never touches a server.",
    intro: [
      "Format conversion changes the container and/or codec a file is wrapped in — for example, turning a .MOV from an iPhone into an .MP4 that's universally playable, or pulling the audio out of a video entirely as an .MP3. Different platforms, editors, and devices each have format preferences, and it's common to need the same source file in two or three different wrappers.",
      "Desktop conversion software requires an install; web-based converters that process server-side require an upload and a queue. This tool does neither — the conversion happens with FFmpeg running as WebAssembly directly in the tab you have open, so the file goes from your device's disk to your device's disk, with the actual transcoding happening entirely in between.",
      "Both video-to-video conversions (MP4 ↔ WebM ↔ MOV ↔ AVI ↔ MKV) and video-to-audio extraction (to MP3, WAV, AAC, OGG, FLAC) are supported from the same control.",
    ],
    useCases: [
      { title: "Fixing iPhone/Mac compatibility", description: "Convert a .MOV file to .MP4 so it plays correctly on Windows, Android, or in a web upload form that rejects QuickTime files." },
      { title: "Extracting audio for a podcast clip", description: "Pull just the audio track out of a recorded video interview as a clean .MP3, without needing separate audio software." },
      { title: "Preparing for a specific editor", description: "Convert footage into the codec/container a particular NLE or platform expects before importing it into a larger project." },
    ],
    faqs: [
      {
        question: "Does converting between formats lose quality?",
        answer: "Converting between two video codecs (e.g. MOV's H.264 to WebM's VP8) involves re-encoding and will have some quality impact, though it's generally minor at default settings. Container-only changes with the same codec are lossless.",
      },
      {
        question: "Can I convert a video straight to MP3?",
        answer: "Yes — select an audio format as the output and the tool extracts and encodes just the audio track, discarding video entirely.",
      },
      {
        question: "Which format should I pick if I'm not sure?",
        answer: "MP4 with H.264 has the widest compatibility across devices, browsers, and platforms, and is the safest default unless something specific (e.g. an editor that prefers MOV) tells you otherwise.",
      },
    ],
    related: ["compress-video", "trim-video", "split-video"],
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
    related: ["split-video", "compress-video", "convert-video"],
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS_CONFIG.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return TOOLS_CONFIG.map((t) => t.slug);
}
