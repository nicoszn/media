"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Zap, Upload, X, ChevronLeft, Download,
  AlertCircle, Loader2, CheckCircle2
} from "lucide-react";
import { useEditor } from "@/hooks/useEditor";
import { OperationConfig, OperationType } from "@/lib/EditorOrchestrator";
import OperationPanel from "./OperationPanel";
import MediaPreview from "./MediaPreview";

const TOOL_LABELS: Record<string, string> = {
  trim: "Trim",
  split: "Split",
  merge: "Merge",
  resize: "Resize",
  compress: "Compress",
  speed: "Speed",
  loop: "Loop",
  fps: "Frame Rate",
  flip: "Flip",
  reverse: "Reverse",
  extract_audio: "Extract Audio",
  extract_frames: "Extract Frames",
  aspect_ratio: "Aspect Ratio",
  format_convert: "Convert Format",
  volume: "Volume",
  rotate: "Rotate",
  denoise: "Denoise",
};

function DropZone({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        width: "100%",
        maxWidth: "520px",
        aspectRatio: "16/9",
        border: `2px dashed ${dragging ? "#7C3AED" : "var(--color-border-bright)"}`,
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        cursor: "pointer",
        background: dragging ? "rgba(124,58,237,0.06)" : "var(--color-card)",
        transition: "all 0.2s",
        padding: "40px",
      }}
    >
      <div style={{
        width: "56px",
        height: "56px",
        background: "rgba(124,58,237,0.12)",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(124,58,237,0.25)",
      }}>
        <Upload size={24} color="#7C3AED" />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "#F1F5F9",
          marginBottom: "6px",
        }}>
          Drop a file here
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          color: "var(--color-text-muted)",
        }}>
          or click to browse — MP4, MOV, WebM, MP3, WAV, and more
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </div>
  );
}

export default function EditorShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialOp = (searchParams.get("op") ?? "trim") as OperationType;
  const [activeOp, setActiveOp] = useState<OperationType>(initialOp);

  const {
    mediaFile, result, progress, progressMessage,
    isLoading, isProcessing, error,
    loadFile, processFile, mergeFiles, clearResult, clearFile,
  } = useEditor();

  const [mergeFiles2, setMergeFiles2] = useState<File[]>([]);

  const handleFile = useCallback(async (file: File) => {
    clearResult();
    await loadFile(file);
  }, [loadFile, clearResult]);

  const handleProcess = useCallback(async (config: OperationConfig) => {
    await processFile(config);
  }, [processFile]);

  const handleMerge = useCallback(async (files: File[]) => {
    await mergeFiles(files);
  }, [mergeFiles]);

  const orch = { formatBytes: (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  }};

  const busy = isLoading || isProcessing;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        height: "56px",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "16px",
        flexShrink: 0,
      }}>
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          textDecoration: "none",
          color: "var(--color-text-secondary)",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
        }}>
          <ChevronLeft size={16} /> Back
        </Link>
        <div style={{ width: "1px", height: "20px", background: "var(--color-border)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "22px",
            height: "22px",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Zap size={11} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#F1F5F9",
          }}>VForge</span>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "var(--color-text-muted)",
            marginLeft: "4px",
          }}>/ editor</span>
        </div>

        {/* Status indicator */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          {isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Loader2 size={13} color="#7C3AED" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "var(--color-text-muted)" }}>
                Loading FFmpeg…
              </span>
            </div>
          )}
          {isProcessing && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Loader2 size={13} color="#06B6D4" style={{ animation: "spin 1s linear infinite" }} />
              <span style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "#06B6D4" }}>
                {progressMessage || "Processing…"}
              </span>
            </div>
          )}
          {mediaFile && !busy && (
            <div style={{
              fontFamily: "DM Mono, monospace",
              fontSize: "11px",
              color: "var(--color-text-muted)",
            }}>
              {mediaFile.name} · {orch.formatBytes(mediaFile.size)}
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: mediaFile ? "1fr 360px" : "1fr",
        overflow: "hidden",
      }}>
        {/* Main area */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: !mediaFile ? "center" : "flex-start",
          padding: "32px 24px",
          overflowY: "auto",
          gap: "24px",
          borderRight: mediaFile ? "1px solid var(--color-border)" : "none",
        }}>
          {!mediaFile ? (
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}>
                {TOOL_LABELS[activeOp] ?? "Editor"} — drop a file to begin
              </div>
              <DropZone onFile={handleFile} />
              {activeOp === "merge" && (
                <div style={{ marginTop: "16px" }}>
                  <label style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                  }}>
                    For merge: select multiple files
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="video/*,audio/*"
                    style={{ display: "none" }}
                    id="merge-input"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      setMergeFiles2(files);
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <MediaPreview media={mediaFile} />

              {/* Progress bar */}
              {isProcessing && (
                <div style={{
                  width: "100%",
                  maxWidth: "520px",
                  background: "var(--color-card)",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  padding: "16px",
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "var(--color-text-secondary)" }}>
                      {progressMessage}
                    </span>
                    <span style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "#7C3AED" }}>
                      {progress}%
                    </span>
                  </div>
                  <div style={{
                    height: "4px",
                    background: "var(--color-border)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>
              )}

              {/* Result */}
              {result?.success && result.outputUrl && (
                <div style={{
                  width: "100%",
                  maxWidth: "520px",
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}>
                  <CheckCircle2 size={22} color="#10B981" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#10B981",
                      marginBottom: "4px",
                    }}>
                      Done — {result.outputName}
                    </div>
                    {result.outputSize && (
                      <div style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "var(--color-text-muted)" }}>
                        {orch.formatBytes(result.outputSize)}
                      </div>
                    )}
                  </div>
                  <a
                    href={result.outputUrl}
                    download={result.outputName}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "#10B981",
                      color: "#fff",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontFamily: "Space Grotesk, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{
                  width: "100%",
                  maxWidth: "520px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}>
                  <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: "1px" }} />
                  <div>
                    <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "13px", fontWeight: 600, color: "#EF4444", marginBottom: "4px" }}>
                      Processing failed
                    </div>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: "11px", color: "var(--color-text-muted)", wordBreak: "break-all" }}>
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {/* Change file */}
              <button
                onClick={clearFile}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-bright)";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }}
              >
                <X size={12} /> Change file
              </button>
            </>
          )}
        </div>

        {/* Side panel */}
        {mediaFile && (
          <div style={{
            width: "360px",
            overflowY: "auto",
            padding: "24px",
            flexShrink: 0,
          }}>
            <OperationPanel
              activeOp={activeOp}
              setActiveOp={setActiveOp}
              media={mediaFile}
              onProcess={handleProcess}
              onMerge={handleMerge}
              busy={busy}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="width: 360px"] {
            width: 100% !important;
            border-top: 1px solid var(--color-border);
            border-right: none !important;
          }
        }
      `}</style>
    </div>
  );
}
