"use client";

import Link from "next/link";
import {
  Scissors, Layers, Maximize2, Archive, Gauge,
  RotateCcw, Film, FlipHorizontal, Rewind,
  Music, Image, Ratio, RefreshCw, Volume2,
  RotateCw, Sparkles, ArrowRight
} from "lucide-react";

const TOOLS = [
  {
    id: "trim",
    icon: Scissors,
    label: "Trim",
    description: "Cut video to precise start and end points",
    color: "#7C3AED",
    badge: "Popular",
  },
  {
    id: "split",
    icon: Layers,
    label: "Split",
    description: "Divide a video into two separate clips",
    color: "#06B6D4",
  },
  {
    id: "merge",
    icon: Layers,
    label: "Merge",
    description: "Combine multiple video files into one",
    color: "#10B981",
  },
  {
    id: "resize",
    icon: Maximize2,
    label: "Resize",
    description: "Change video dimensions and resolution",
    color: "#F59E0B",
  },
  {
    id: "compress",
    icon: Archive,
    label: "Compress",
    description: "Reduce file size while preserving quality",
    color: "#EF4444",
    badge: "Popular",
  },
  {
    id: "speed",
    icon: Gauge,
    label: "Speed",
    description: "Speed up or slow down video playback",
    color: "#8B5CF6",
  },
  {
    id: "loop",
    icon: RotateCcw,
    label: "Loop",
    description: "Repeat a video clip N times",
    color: "#06B6D4",
  },
  {
    id: "fps",
    icon: Film,
    label: "Frame Rate",
    description: "Change video frames per second",
    color: "#F59E0B",
  },
  {
    id: "flip",
    icon: FlipHorizontal,
    label: "Flip",
    description: "Mirror video horizontally, vertically, or both",
    color: "#10B981",
  },
  {
    id: "reverse",
    icon: Rewind,
    label: "Reverse",
    description: "Play video backwards with reversed audio",
    color: "#EF4444",
  },
  {
    id: "extract_audio",
    icon: Music,
    label: "Extract Audio",
    description: "Pull the audio track from any video",
    color: "#7C3AED",
  },
  {
    id: "extract_frames",
    icon: Image,
    label: "Extract Frames",
    description: "Export frames as image files",
    color: "#06B6D4",
  },
  {
    id: "aspect_ratio",
    icon: Ratio,
    label: "Aspect Ratio",
    description: "Reformat to 16:9, 9:16, 1:1, and more",
    color: "#8B5CF6",
  },
  {
    id: "format_convert",
    icon: RefreshCw,
    label: "Convert Format",
    description: "Convert between MP4, WebM, MOV, MP3, and more",
    color: "#10B981",
    badge: "Popular",
  },
  {
    id: "volume",
    icon: Volume2,
    label: "Volume",
    description: "Boost or reduce audio volume",
    color: "#F59E0B",
  },
  {
    id: "rotate",
    icon: RotateCw,
    label: "Rotate",
    description: "Rotate video by 90°, 180°, or 270°",
    color: "#EF4444",
  },
  {
    id: "denoise",
    icon: Sparkles,
    label: "Denoise",
    description: "Reduce video noise and grain",
    color: "#7C3AED",
  },
];

export default function ToolsGrid() {
  return (
    <section id="tools" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "#06B6D4",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            // tool suite
          </span>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-1.5px",
            color: "#F1F5F9",
            marginTop: "12px",
            marginBottom: "16px",
          }}>
            Everything you need
          </h2>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "var(--color-text-secondary)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            {TOOLS.length} professional operations running natively in your browser.
            No account required.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={`/editor?op=${tool.id}`}
                style={{
                  display: "block",
                  padding: "24px",
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "14px",
                  textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = `${tool.color}44`;
                  e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px ${tool.color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Accent glow */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${tool.color}66, transparent)`,
                }} />

                {/* Icon */}
                <div style={{
                  width: "44px",
                  height: "44px",
                  background: `${tool.color}18`,
                  border: `1px solid ${tool.color}33`,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}>
                  <Icon size={20} color={tool.color} />
                </div>

                {/* Badge */}
                {tool.badge && (
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    padding: "2px 8px",
                    background: `${tool.color}22`,
                    border: `1px solid ${tool.color}44`,
                    borderRadius: "100px",
                    fontFamily: "DM Mono, monospace",
                    fontSize: "10px",
                    color: tool.color,
                    letterSpacing: "0.05em",
                  }}>
                    {tool.badge}
                  </div>
                )}

                <div style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#F1F5F9",
                  marginBottom: "6px",
                }}>
                  {tool.label}
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                }}>
                  {tool.description}
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/editor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              boxShadow: "0 0 30px rgba(124,58,237,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Open the Editor <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
